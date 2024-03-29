import React from "react";
import { RiLoader4Fill } from "react-icons/ri";
import { Button } from "./ui/button";

export const ActionBtns = ({
  approveBtn,
  sendBtn,
  TokenApproval,
  SendGiveaway,
  approveBtnLoading,
  sendBtnLoading,
}: {
  approveBtn: boolean;
  sendBtn: boolean;
  TokenApproval: () => void;
  SendGiveaway: () => void;
  approveBtnLoading: boolean;
  sendBtnLoading: boolean;
}) => {
  return (
    <div className="w-full flex justify-center gap-10 py-10">
      <Button
        disabled={approveBtn}
        className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-fit  text-black"
        onClick={TokenApproval}
      >
        {approveBtnLoading ? (
          <>
            <RiLoader4Fill className="animate-spin w-6 h-6 mr-3" />
            Approving tokens
          </>
        ) : (
          "Approve Tokens"
        )}
      </Button>
      <Button
        disabled={sendBtn}
        className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-sm w-fit  text-black"
        onClick={SendGiveaway}
      >
        {sendBtnLoading ? (
          <>
            <RiLoader4Fill className="animate-spin w-6 h-6 mr-3" /> Sending
            Giveaway{" "}
          </>
        ) : (
          "Send Giveaway"
        )}
      </Button>
    </div>
  );
};
