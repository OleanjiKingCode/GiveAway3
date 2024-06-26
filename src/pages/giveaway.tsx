import { Roboto } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { GIVEAWAY_CHAINS } from "@/components/data";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useNetwork,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { SwitchChain } from "@/utils/switchNetwork";
import { formatEther, isAddress, parseUnits, toHex } from "viem";
import { Txns } from "@/components/txns";
import {
  AxelarQueryAPI,
  Environment,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import GiveAwayContractABI from "@/components/ABI.json";
import { useToast } from "@/components/ui/use-toast";
import { ActionBtns } from "@/components/ActionBtns";
import { ActionArea } from "@/components/ActionArea";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Giveaway() {
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  const { toast } = useToast();

  //user balance
  const { data: userBal, refetch: refectchUserBal } = useBalance({
    address: address,
  });

  // txn data
  const [txnLoading, setTxnLoading] = useState(false);
  const [txnData, setTxnData] = useState<any>();

  //states of the giveaway detailss
  const [senderChain, setSenderChain] = useState(
    chains.findIndex((chain) => chain.id === chain.id) < 0
      ? "0"
      : chains.findIndex((chain) => chain.id === chain.id).toString()
  );
  const [receiverChain, setReceiverChain] = useState("arbitrum-sepolia");
  const [tokenAmount, setTokenAmount] = useState(20);
  const [addresses, setAddresses] = useState("Approve Token first");

  /// button states
  const [approveBtn, setAprroveBtn] = useState(false);
  const [approveBtnLoading, setAprroveBtnLoading] = useState(false);
  const [sendBtnLoading, setSendBtnLoading] = useState(false);
  const [sendBtn, setSendBtn] = useState(true);
  const [textAreaDisabled, setTextAreaDisabled] = useState(true);

  /// Axelar
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

  // Approve token to be spent by the contract
  const { data: approveData, writeAsync: approveWrite } = useContractWrite({
    address: GIVEAWAY_CHAINS[Number(senderChain)]?.aUSDC_CA as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
  });

  const {
    data: approveHashData,
    isSuccess: approveHashSuccess,
    isError: aprroveHashError,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  // Send tokens giveaway
  const { data: giveawayData, writeAsync: giveawayWrite } = useContractWrite({
    address: GIVEAWAY_CHAINS[Number(senderChain)]
      ?.Giveaway_Address as `0x${string}`,
    abi: GiveAwayContractABI,
    functionName: "giveTokensAway",
  });

  const {
    data: giveawayHashData,
    isSuccess: giveawayHashSuccess,
    isError: giveawayHashError,
  } = useWaitForTransaction({
    hash: giveawayData?.hash,
  });

  const {
    data: historyData,
    refetch,
    isLoading,
    isSuccess: historyDataSuccessful,
  } = useContractRead({
    address: GIVEAWAY_CHAINS[Number(senderChain)]
      ?.Giveaway_Address as `0x${string}`,
    abi: GiveAwayContractABI,
    functionName: "getAllGiveAwayItemsPerAddress",
    args: [address],
  });

  const changeNetwork = async (e: string) => {
    setSenderChain(e);
    await SwitchChain({
      chainId: toHex(chains[Number(e)].id),
      chainName: chains[Number(e)].name,
      rpcUrls: [...chains[Number(e)].rpcUrls.default.http],
    });
  };

  const checkAllAddresses = () => {
    let receiversAddressesArray = addresses.split(",");
    let isAllCorrect = receiversAddressesArray.every((add) => isAddress(add));
    return { receiversAddressesArray, isAllCorrect };
  };

  const gasEstimator = async () => {
    let symbol = "";
    switch (Number(senderChain)) {
      case 0:
        symbol = GasToken.MATIC;
        break;
      case 1:
        symbol = GasToken.FTM;
        break;
      case 2:
        symbol = GasToken.ARBITRUM_SEPOLIA;
        break;

      default:
        break;
    }

    const gas = await api.estimateGasFee(
      GIVEAWAY_CHAINS[Number(senderChain)].chainName,
      receiverChain,
      symbol,
      700000,
      2
    );
    return gas;
  };

  const TokenApproval = async () => {
    try {
      setAprroveBtnLoading(true);
      if (!tokenAmount || tokenAmount === 0) {
        toast({
          description: "Please enter a valid token amount",
          style: { backgroundColor: "red", color: "white" },
        });
        setAprroveBtnLoading(false);
        return;
      }
      let currentChain = GIVEAWAY_CHAINS[Number(senderChain)];

      toast({
        description: "Approving your token",
        style: {
          backgroundColor: "#c8dcfc",
          border: "1px solid blue",
          color: "black",
        },
      });
      await approveWrite({
        args: [
          currentChain.Giveaway_Address as `0x${string}`,
          parseUnits(`${tokenAmount}`, 6),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const SendGiveaway = async () => {
    try {
      setSendBtnLoading(true);

      let gasFee: any = await gasEstimator();
      if (Number(userBal?.formatted) <= Number(formatEther(gasFee))) {
        toast({
          title: "You dont have enough funds for gas",
          description: `You need ${(
            Number(formatEther(gasFee)) - Number(userBal?.formatted)
          ).toFixed(3)} ETH more`,
          style: { backgroundColor: "red", color: "white" },
        });
        setSendBtnLoading(false);
        return;
      }

      let addressesInfo = checkAllAddresses();
      if (!addressesInfo.isAllCorrect) {
        toast({
          description:
            "Receiving addresses contain a zero or an invalid address(es)",
          style: { backgroundColor: "red", color: "white" },
        });
        setSendBtnLoading(false);
        return;
      }

      let currentChain = GIVEAWAY_CHAINS[Number(senderChain)];

      if (currentChain.chainName <= receiverChain) {
        toast({
          description: "You tried sending to the same chain",
          style: { backgroundColor: "red", color: "white" },
        });
        setSendBtnLoading(false);
        return;
      }

      setTextAreaDisabled(true);
      toast({
        description: "Giving away tokens",
        style: {
          backgroundColor: "#c8dcfc",
          border: "1px solid blue",
          color: "black",
        },
      });
      await giveawayWrite({
        args: [
          receiverChain,
          GIVEAWAY_CHAINS.find((chain) => chain.chainName === receiverChain)
            ?.Giveaway_Address,
          addressesInfo.receiversAddressesArray,
          "aUSDC",
          parseUnits(`${tokenAmount}`, 6),
        ],
        value: gasFee,
      });
    } catch (error) {
      setSendBtnLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (approveHashSuccess) {
      setAprroveBtnLoading(false);
      setAddresses("Enter the addresses in this format: 0xabc...,0x123...");
      setAprroveBtn(true);
      setTextAreaDisabled(false);
      setSendBtn(false);
      toast({
        description: "Successfully approved token",
        style: {
          backgroundColor: "#38ff89",
          border: "1px solid green",
          color: "black",
        },
      });
    }
    if (aprroveHashError) {
      setAprroveBtnLoading(false);
      toast({
        description: "Error occured during approval",
        style: { backgroundColor: "red", color: "white" },
      });
    }
    refectchUserBal();
  }, [approveHashSuccess, approveHashData, aprroveHashError]);

  useEffect(() => {
    if (giveawayHashSuccess) {
      setSendBtnLoading(false);
      refetch();
      setSendBtn(true);
      setAprroveBtn(false);
      toast({
        description: "Giveaway successfully done!",
        style: {
          backgroundColor: "#38ff89",
          border: "1px solid green",
          color: "black",
        },
      });
    }
    if (giveawayHashError) {
      setSendBtnLoading(false);
      setTextAreaDisabled(false);
      toast({
        description: "Error occured during giveaway",
        style: { backgroundColor: "red", color: "white" },
      });
    }
    refectchUserBal();
  }, [giveawayHashData, giveawayHashSuccess, giveawayHashError]);

  useEffect(() => {
    refetch();
  }, [senderChain]);

  useEffect(() => {
    setSenderChain(
      chain ? chains.findIndex((c) => c.id === chain.id).toString() : "0"
    );
    refetch();
  }, [chain]);

  useEffect(() => {
    setTxnData(historyData);
  }, [historyDataSuccessful, historyData]);

  return (
    <div
      className={`w-full flex flex-col min-h-screen bg-pink-100 ${roboto.className} `}
    >
      <Navbar />
      {isConnected ? (
        <div className="w-full flex flex-col min-h-[80vh] items-center justify-center px-3 md:px-20 mt-[40px]">
          <div className=" w-full flex flex-col items-center justify-center gap-10 mb-[10px]">
            <ActionArea
              changeNetwork={changeNetwork}
              senderChain={senderChain}
              tokenAmount={tokenAmount}
              setTokenAmount={setTokenAmount}
              setReceiverChain={setReceiverChain}
              receiverChain={receiverChain}
            />

            <div className="w-[60%] flex flex-col gap-3">
              <Label htmlFor="addresses">Receivers Addresses:</Label>
              <Textarea
                placeholder="Paste or type in receivers addresses"
                id="addresses"
                disabled={textAreaDisabled}
                value={addresses}
                onChange={(e) => setAddresses(e.target.value)}
              />
            </div>

            <ActionBtns
              approveBtn={approveBtn}
              sendBtn={sendBtn}
              TokenApproval={TokenApproval}
              SendGiveaway={SendGiveaway}
              approveBtnLoading={approveBtnLoading}
              sendBtnLoading={sendBtnLoading}
            />
          </div>

          <Txns data={txnData} isLoading={isLoading} />
        </div>
      ) : (
        <div className="w-full flex flex-col min-h-[80vh] items-center justify-center px-3 md:px-20 mt-[40px]">
          <h3>Connect your wallet </h3>
        </div>
      )}
    </div>
  );
}
