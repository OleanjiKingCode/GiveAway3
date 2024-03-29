import { Roboto } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaArrowRight } from "react-icons/fa";
import {
  FANTOM_CONTRACT_ADDRESS,
  GIVEAWAY_CHAINS,
  invoices,
} from "@/components/data";
import { Button } from "@/components/ui/button";
import { RiLoader4Fill } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { config } from "@/config/wagmiConfig";
import { SwitchChain } from "@/utils/switchNetwork";
import { erc20Abi, isAddress, parseUnits, toHex } from "viem";
import { Txns } from "@/components/txns";
import { Input } from "@/components/ui/input";
import {
  AxelarQueryAPI,
  Environment,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import GiveAwayContractABI from "@/components/ABI.json";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Giveaway() {
  const { chains } = useSwitchChain({ config });
  const { address, chain } = useAccount();

  // txn data
  const [txnLoading, setTxnLoading] = useState(false);
  const [txnData, setTxnData] = useState<any>(invoices);

  //states of the giveaway detailss
  const [senderChain, setSenderChain] = useState(
    chain ? chains.indexOf(chain).toString() : "0"
  );
  const [receiverChain, setReceiverChain] = useState("arbitrum-sepolia");
  const [token, setToken] = useState("aUSDC");
  const [tokenAmount, setTokenAmount] = useState(20);
  const [addresses, setAddresses] = useState("0xabc...,0x123...");

  /// button states
  const [approveBtn, setAprroveBtn] = useState(true);
  const [approveBtnLoading, setAprroveBtnLoading] = useState(false);
  const [sendBtnLoading, setSendBtnLoading] = useState(false);
  const [sendBtn, setSendBtn] = useState(true);

  /// Axelar
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

  // Approve token to be spent by the contract
  const { data: USDCData, writeContractAsync: approveWrite } =
    useWriteContract();

  // Send tokens giveaway
  const { data: giveawayData, writeContractAsync: giveawayWrite } =
    useWriteContract();

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
      if (!tokenAmount) {
        //toast.error("Please enter amount", toastOptions);
        return;
      }
      let currentChain = GIVEAWAY_CHAINS[Number(senderChain)];
      // toast saying starting
      setAprroveBtnLoading(true);
      await approveWrite(
        {
          address: currentChain.aUSDC_CA as `0x${string}`, // Address of the aUSDC contract on Fantom
          abi: erc20Abi,
          functionName: "approve",
          args: [
            currentChain.Giveaway_Address as `0x${string}`,
            parseUnits(tokenAmount.toString(), 6),
          ],
        },
        {
          onSuccess: () => {
            setAprroveBtnLoading(false);
            setAprroveBtn(true);
            setSendBtn(false);

            // toast saying done
          },
          onError: () => {
            setAprroveBtnLoading(false);
            // toast saying error
          },
        }
      );

      //toast.info("Approving...", toastOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const SendGiveaway = async () => {
    try {
      let gasFee: any = await gasEstimator();

      if (!gasFee) return null;

      let addressesInfo = checkAllAddresses();

      if (!addressesInfo.isAllCorrect) return null;

      let currentChain = GIVEAWAY_CHAINS[Number(senderChain)];

      // toast saying starting
      setSendBtnLoading(true);
      await giveawayWrite(
        {
          address: currentChain.Giveaway_Address as `0x${string}`,
          abi: GiveAwayContractABI,
          functionName: "giveTokensAway",
          args: [
            receiverChain,
            GIVEAWAY_CHAINS.find((chain) => chain.chainName === receiverChain)
              ?.Giveaway_Address,
            addressesInfo.receiversAddressesArray,
            "aUSDC",
            parseUnits(tokenAmount.toString(), 6),
          ],
          value: gasFee,
        },
        {
          onSuccess: () => {
            setSendBtnLoading(false);
            setSendBtn(true);
            setAprroveBtn(false);

            // toast saying done
          },
          onError: () => {
            setSendBtnLoading (false);
            // toast saying error
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSenderChain(chain ? chains.indexOf(chain).toString() : "0");
  }, [chain]);

  return (
    <div
      className={`w-full flex flex-col min-h-screen bg-pink-100 ${roboto.className} `}
    >
      <Navbar />
      <div className="w-full flex flex-col min-h-[80vh] items-center justify-center px-3 md:px-20 mt-[140px]">
        <div className=" w-full flex flex-col items-center justify-center gap-10 mb-[10px]">
          <div className="w-full flex gap-6 items-center justify-center">
            <div className="flex flex-col gap-3 items-center">
              <Label>Sending Chain</Label>
              <Select
                onValueChange={(e) => changeNetwork(e)}
                value={senderChain}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select chain to send from" />
                </SelectTrigger>
                <SelectContent>
                  {GIVEAWAY_CHAINS.map((chain, i) => (
                    <SelectItem value={i.toString()} key={i}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FaArrowRight className="h-3 w-3 mt-5" />

            <div className="flex flex-col gap-3 items-center">
              <Label>Token</Label>
              <div className="flex gap-3 items-center justify-center">
                <Input
                  type="number"
                  value={tokenAmount}
                  min={0}
                  className="w-fit"
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                />
                <span>aUSDC</span>
                {/* <Select onValueChange={(e) => setToken(e)} value={token}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_COINS.map((chain, i) => (
                      <SelectItem value={chain.symbol} key={i}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>
            </div>

            <FaArrowRight className="h-3 w-3 mt-5" />

            <div className="flex flex-col gap-3 items-center">
              <Label>Receiving Chain</Label>
              <Select
                onValueChange={(e) => setReceiverChain(e)}
                value={receiverChain}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select chain of receivers" />
                </SelectTrigger>
                <SelectContent>
                  {GIVEAWAY_CHAINS.map((chain, i) => (
                    <SelectItem value={chain.chainName} key={i}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-[60%] flex flex-col gap-3">
            <Label htmlFor="addresses">Receivers Addresses:</Label>
            <Textarea
              placeholder="Paste or type in receivers addresses"
              id="addresses"
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
            />
          </div>

          <div className="w-full flex justify-center gap-10 py-10">
            <Button
              disabled={approveBtn}
              className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-fit  text-black"
            >
              {approveBtnLoading ? (
                <RiLoader4Fill className="animate-spin w-6 h-6" />
              ) : (
                "Approve Tokens"
              )}
            </Button>
            <Button
              disabled={sendBtn}
              className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-fit  text-black"
            >
              {sendBtnLoading ? (
                <RiLoader4Fill className="animate-spin w-6 h-6" />
              ) : (
                "Send Giveaway"
              )}
            </Button>
          </div>
        </div>

        <Txns data={txnData} isLoading={txnLoading} />
      </div>
    </div>
  );
}
