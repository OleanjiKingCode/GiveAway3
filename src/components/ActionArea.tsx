import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { GIVEAWAY_CHAINS } from "./data";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const ActionArea = ({
  changeNetwork,
  senderChain,
  tokenAmount,
  setTokenAmount,
  setReceiverChain,
  receiverChain,
}: {
  changeNetwork: (e: string) => Promise<void>;
  senderChain: string;
  tokenAmount: number;
  setTokenAmount: React.Dispatch<React.SetStateAction<number>>;
  setReceiverChain: React.Dispatch<React.SetStateAction<string>>;
  receiverChain: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-2  md:flex-row md:gap-6 items-center justify-center">
      <div className="flex flex-col gap-3 items-center">
        <Label>Sending Chain</Label>
        <Select onValueChange={(e) => changeNetwork(e)} value={senderChain}>
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

      <FaArrowRight className="h-3 w-3 mt-5 hidden md:flex" />
      <FaArrowDown className="h-3 w-3 mb-3 md:hidden" />

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
        </div>
      </div>

      <FaArrowRight className="h-3 w-3 mt-5 hidden md:flex" />
      <FaArrowDown className="h-3 w-3 mb-3 md:hidden" />

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
  );
};
