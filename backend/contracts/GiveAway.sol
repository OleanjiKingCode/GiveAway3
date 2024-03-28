// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Importing from the Axelar network SDK
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";

/// @title GiveAway Contract using Axelar
/// @author Oleanji
/// @notice A contracts that allows users to send tokens to multiple addresses from one chain to another

contract GiveAwayContract is AxelarExecutable {
    /// -----------------------------------------------------------------------
    /// Errors
    /// -----------------------------------------------------------------------
    error CannotHaveZeroGasFees();
    error CannotSendZeroTokens();
    error ReceiversShouldBeAtLeastOne();

    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------
    event GiveAwayDone(
        address indexed giver,
        address[] receivers,
        uint256 totalAmount,
        uint256 amountPerUser,
        string destinationChain,
        string symbol,
        uint256 timestamp
    );

    /// -----------------------------------------------------------------------
    /// Structs
    /// -----------------------------------------------------------------------
    struct GiveAwayItem {
        address giver;
        address[] receivers;
        uint256 totalAmount;
        uint256 amountPerUser;
        string destinationChain;
        string symbol;
        uint256 timestamp;
    }

    /// -----------------------------------------------------------------------
    /// Mappings
    /// -----------------------------------------------------------------------
    mapping(address => GiveAwayItem[]) public giveAwayItems;

    // Immutable variable for the Axelar gas service
    IAxelarGasService public immutable gasService;

    /// -----------------------------------------------------------------------
    /// Constructor
    /// -----------------------------------------------------------------------

    /// @notice  Constructor sets up the contract by initializing Axelar Gateway and Gas Service
    constructor(
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    /// -----------------------------------------------------------------------
    /// External functions
    /// -----------------------------------------------------------------------

    /// @notice gives away tokens to specified address in the param
    /// @param destinationChain the chain for which the tokens are sent to
    /// @param destinationAddress the address of the contract on of the other chain that compltes this txn
    /// @param destinationAddresses the array of addresses that will receive the tokens
    /// @param symbol the symbol of the token being sent
    /// @param amount the amount of the token sent

    function giveTokensAway(
        string memory destinationChain,
        string memory destinationAddress,
        address[] calldata destinationAddresses,
        string memory symbol,
        uint256 amount
    ) external payable {
        if (msg.value <= 0) revert CannotHaveZeroGasFees();
        if (destinationAddresses.length == 0)
            revert ReceiversShouldBeAtLeastOne();
        if (amount <= 0) revert CannotSendZeroTokens();

        // Getting the token address for the provided symbol
        address tokenAddress = gateway.tokenAddresses(symbol);

        // Transferring tokens from sender to this contract and approving gateway for the amount
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);

        // Encoding the destination addresses in a payload
        bytes memory payload = abi.encode(destinationAddresses);

        // Paying gas in native currency and initiating the cross-chain call
        gasService.payNativeGasForContractCallWithToken{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount,
            msg.sender
        );

        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );

        GiveAwayItem memory newGiveAwayItem = GiveAwayItem(
            msg.sender,
            destinationAddresses,
            amount,
            amount / destinationAddresses.length,
            destinationChain,
            symbol,
            block.timestamp
        );

        GiveAwayItem[] storage giveaways = giveAwayItems[msg.sender];

        // If the giveaways array is empty, push the newGiveAwayItem directly
        if (giveaways.length == 0) {
            giveAwayItems[msg.sender].push(newGiveAwayItem);
        } else {
            // If the giveaways array already contains items, simply push the newGiveAwayItem
            giveaways.push(newGiveAwayItem);
            giveAwayItems[msg.sender] = giveaways;
        }

        emit GiveAwayDone(
            msg.sender,
            destinationAddresses,
            amount,
            amount / destinationAddresses.length,
            destinationChain,
            symbol,
            block.timestamp
        );
    }

    // Internal function override to execute token transfer upon cross-chain call
    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        // Decoding the payload to get recipient addresses
        address[] memory receivers = abi.decode(payload, (address[]));
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        //Distributing the tokens equally among the receivers
        uint256 sentAmount = amount / receivers.length;
        for (uint256 i = 0; i < receivers.length; i++) {
            IERC20(tokenAddress).transfer(receivers[i], sentAmount);
        }
    }

    function getAllGiveAwayItemsPerAddress(
        address _giver
    ) external view returns (GiveAwayItem[] memory) {
        return giveAwayItems[_giver];
    }

    /// @notice Used to receive ether
    receive() external payable {}
}
