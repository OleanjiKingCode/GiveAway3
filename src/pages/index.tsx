import { Roboto } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Home() {
  return (
    <main
      className={`w-full flex flex-col min-h-screen  bg-pink-100 ${roboto.className}`}
    >
      <Navbar />
      <div className="w-full justify-between flex flex-col-reverse md:flex-row gap-4 md:gap-0items-center px-20 mt-[20px] md:mt-[60px] pb-10">
        <div className="flex flex-col gap-3 w-full  md:w-[50%]">
          <h2 className="text-xl md:text-[56px] text-[#333] leading-snug">
            <span className="text-[#555] "> Giveaway3:</span> Empower seamless
            token sharing across diverse chains with Axelar
          </h2>
          <Link href="/giveaway">
            <Button className="bg-pink-200 hover:bg-pink-600 rounded-md shadow-md text-base w-full md:w-fit py-6 px-10 text-black">
              Start Giving Away 💸
            </Button>
          </Link>
        </div>
        <img src="/GW3.png" alt="/giveaway" width={400} height={300} />
      </div>
    </main>
  );
}
