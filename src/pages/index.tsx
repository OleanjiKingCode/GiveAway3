import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

export default function Home() {
  return (
    <main
      className={`w-full flex flex-col min-h-screen  bg-pink-100 ${roboto.className}`}
    ></main>
  );
}
