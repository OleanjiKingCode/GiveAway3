import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { RiGithubFill } from "react-icons/ri";

export const Navbar = () => {
  return (
    <div className="fixed w-full flex flex-row justify-between px-5 bg-pink-100 items-center pt-9 pb-2 text-black">
      <div className="w-full flex flex-row justify-between px-10 items-center py-3 bg-white rounded-3xl">
        <Link href="/">
          <div className="font-semibold text-lg">GiveAway3</div>
        </Link>
        <div className="flex gap-5 justify-center items-center">
          <ConnectButton />
          <Link href="/" target="_blank">
            <RiGithubFill className="text-xl" />
          </Link>
        </div>
      </div>
    </div>
  );
};