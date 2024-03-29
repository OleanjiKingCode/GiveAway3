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
import { ASSET_COINS, GIVEAWAY_CHAINS } from "@/components/data";
import { Button } from "@/components/ui/button";
import { RiLoader4Fill } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAccount, useSwitchChain } from "wagmi";
import { config } from "@/config/wagmiConfig";
import { SwitchChain } from "@/utils/switchNetwork";
import { toHex } from "viem";
import { Txns } from "@/components/txns";
import { Input } from "@/components/ui/input";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Giveaway() {
  const { chains } = useSwitchChain({ config });
  const { address, chain } = useAccount();

  const [senderChain, setSenderChain] = useState(
    chain ? chains.indexOf(chain).toString() : "0"
  );
  const [receiverChain, setReceiverChain] = useState("arbitrum-sepolia");
  const [token, setToken] = useState("aUSDC");
  const [tokenAmount, setTokenAmount] = useState(20);
  const [addresses, setAddresses] = useState("");

  useEffect(() => {
    setSenderChain(chain ? chains.indexOf(chain).toString() : "0");
  }, [chain]);

  const changeNetwork = async (e: string) => {
    setSenderChain(e);
    console.log(e);
    await SwitchChain({
      chainId: toHex(chains[Number(e)].id),
      chainName: chains[Number(e)].name,
      rpcUrls: [...chains[Number(e)].rpcUrls.default.http],
    });
  };

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
                <Select onValueChange={(e) => setToken(e)} value={token}>
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
                </Select>
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
            <Button className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-fit  text-black">
              {false ? (
                <RiLoader4Fill className="animate-spin w-6 h-6" />
              ) : (
                "Approve Tokens"
              )}
            </Button>
            <Button className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-fit  text-black">
              {false ? (
                <RiLoader4Fill className="animate-spin w-6 h-6" />
              ) : (
                "Send Giveaway"
              )}
            </Button>
          </div>
        </div>

        <Txns />
      </div>
    </div>
  );
}
