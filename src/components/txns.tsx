import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { RiLoader4Fill } from "react-icons/ri";
import { formatUnits } from "viem";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";
import { ReceiversModal } from "./ReceiversModal";
import { Button } from "./ui/button";

export const Txns = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [receivers, setReceivers] = useState([]);
  function convertTimestampToDateTime(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <>
      {" "}
      <h2 className="w-[80%] px-5 bg-white py-3 rounded-xl my-5 text-center font-semibold">
        Transaction History
      </h2>
      <div className="bg-white flex flex-col gap-3 w-full p-4 rounded-lg mb-10 ">
        {isLoading ? (
          <div className="w-full flex flex-col gap-2 py-32 items-center justify-center">
            <RiLoader4Fill className="animate-spin w-16 h-16" />
            <span className="text-base">Loading Giveaway Data</span>
          </div>
        ) : (
          <div className="w-full">
            {data && data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">#</TableHead>
                    <TableHead className="">Receivers</TableHead>
                    <TableHead className="">Destion Chain</TableHead>
                    <TableHead className="">Token</TableHead>
                    <TableHead className="">Total Amount</TableHead>
                    <TableHead className="">Amount per receiver</TableHead>
                    <TableHead className="">No of receivers</TableHead>
                    <TableHead className="">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((invoice: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="font-medium">
                        <div
                          className="text-base cursor-pointer"
                          onClick={() => {
                            setIsOpen(true);
                            setReceivers(invoice.receivers);
                          }}
                        >
                          View all receivers
                        </div>
                      </TableCell>
                      <TableCell>{invoice.destinationChain}</TableCell>
                      <TableCell>{invoice.symbol}</TableCell>
                      <TableCell>
                        {formatUnits(invoice.totalAmount, 6)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatUnits(invoice.amountPerUser, 6)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.receivers?.length}
                      </TableCell>
                      <TableCell className="font-medium">
                        {convertTimestampToDateTime(
                          Number(invoice.timestamp) * 1000
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="w-full flex py-32 items-center justify-center">
                <span className="text-base">No Data Available</span>
              </div>
            )}
          </div>
        )}
      </div>
      <ReceiversModal
        data={receivers}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
