import shortenAccount from "@/utils/shoternAddress";
import React from "react";
import { IoCopy } from "react-icons/io5";
import { TiExport } from "react-icons/ti";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { RiLoader4Fill } from "react-icons/ri";

export const Txns = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  return (
    <>
      {" "}
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
            {isLoading ? (
              <div className="w-full flex flex-col gap-2 items-center justify-center">
                <RiLoader4Fill className="animate-spin w-16 h-16" />
                <span className="text-lg">Loading Data</span>
              </div>
            ) : (
              <>
                {data.length === 0 && (
                  <div className="w-full flex items-center justify-center">
                    <span className="text-lg">No Data Available</span>
                  </div>
                )}
                {data.length > 0 &&
                  data.map((invoice: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {invoice["#"]}
                      </TableCell>
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
                      <TableCell className="font-medium">
                        {invoice.Date}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
