import { Roboto } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import shortenAccount from "@/utils/shoternAddress";
import React from "react";
import { IoCopy } from "react-icons/io5";
import { TiExport } from "react-icons/ti";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaArrowRight } from "react-icons/fa";
import { GIVEAWAY_CHAINS } from "@/components/data";
import { Button } from "@/components/ui/button";
import { RiLoader4Fill } from "react-icons/ri";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Giveaway() {
  const invoices = [
    {
      "#": "1",
      txnHash: "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b",
      Giver:
        "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b4b9421bb4139b173",
      totalAmount: 400,
      amountPerReceiver: 100,
      NoOfReceivers: 4,
      Date: "26th Jan2023",
    },
    {
      "#": "2",
      txnHash: "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b",
      Giver:
        "0x7c6c99d3a174c1c27ee2eaa10aa8c935ad86d6a0daf472dd5b9acb5f41adb0d7",
      totalAmount: 400,
      amountPerReceiver: 100,
      NoOfReceivers: 4,
      Date: "26th Jan2023",
    },
    {
      "#": "3",
      txnHash: "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b",
      Giver:
        "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b4b9421bb4139b173",
      totalAmount: 400,
      amountPerReceiver: 100,
      NoOfReceivers: 4,
      Date: "26th Jan2023",
    },
    {
      "#": "4",
      txnHash: "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b",
      Giver:
        "0x7c6c99d3a174c1c27ee2eaa10aa8c935ad86d6a0daf472dd5b9acb5f41adb0d7",
      totalAmount: 400,
      amountPerReceiver: 100,
      NoOfReceivers: 4,
      Date: "26th Jan2023",
    },
    {
      "#": "5",
      txnHash: "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b",
      Giver:
        "0x888166ebc4dfe361f323db776758a13917e2c555fb66be6b4b9421bb4139b173",
      totalAmount: 400,
      amountPerReceiver: 100,
      NoOfReceivers: 4,
      Date: "26th Jan2023",
    },
  ];

  return (
    <div
      className={`w-full flex flex-col min-h-screen bg-pink-100 ${roboto.className} `}
    >
      <Navbar />
      <div className="w-full flex flex-col min-h-[80vh] items-center justify-center px-3 md:px-20 mt-[85px]">
        <div className="mt-[100px] mb-[30px]">
          <span>Do giveways</span>
          <div className="w-full flex gap-6 items-center">
            <Select>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select chain to send from" />
              </SelectTrigger>
              <SelectContent>
                {GIVEAWAY_CHAINS.map((chain, i) => (
                  <SelectItem value={chain.chainName} key={i}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FaArrowRight />
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <FaArrowRight />

            <Select>
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

          <div className="w-full flex justify-between gap-10 py-10">
            <Button className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-full font-semibold text-black">
              {false ? (
                <RiLoader4Fill className="animate-spin w-6 h-6" />
              ) : (
                "Approve Tokens"
              )}
            </Button>
            <Button className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-full font-semibold text-black">
              {false ? (
                <RiLoader4Fill className="animate-spin w-6 h-6" />
              ) : (
                "Send Giveaway"
              )}
            </Button>
          </div>
        </div>

        <h2 className="w-[80%] px-5 bg-white py-3 rounded-xl my-5 text-center font-semibold">
          Transaction History
        </h2>
        <div className="bg-white flex flex-col gap-3 w-full p-4 rounded-lg mb-10 ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead className="">TxnHash</TableHead>
                <TableHead className="">Giver</TableHead>
                <TableHead className="w-[200px]">Total Amount</TableHead>
                <TableHead className="w-[200px]">Amount per receiver</TableHead>
                <TableHead className="">No of receivers</TableHead>
                <TableHead className="">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice["#"]}>
                  <TableCell className="font-medium">{invoice["#"]}</TableCell>
                  <TableCell>
                    <div className="p-1 text-gray-800 bg-gray-400 rounded-md font-medium text-center">
                      {shortenAccount(invoice.txnHash)}
                    </div>
                  </TableCell>
                  <TableCell className="w-fit">
                    <div className="py-1 px-2 bg-gray-100 flex items-center rounded-md justify-start w-fit">
                      <span className="font-semibold text-black text-sm">
                        {shortenAccount(invoice.Giver)}
                      </span>
                      <IoCopy
                        className="ml-2 h-4 w-4 text-blue-400 cursor-pointer"
                        title="Copy"
                      />
                      <TiExport
                        className="ml-3 h-4 w-4 text-green-800 cursor-pointer"
                        title="explorer"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="p-1 text-gray-800 bg-gray-400 rounded-md font-medium text-center">
                      {invoice.totalAmount}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.amountPerReceiver}
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.NoOfReceivers}
                  </TableCell>
                  <TableCell className="font-medium">{invoice.Date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
