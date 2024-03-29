import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonMumbai, fantomTestnet, arbitrumSepolia } from "wagmi/chains";

const Id = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";
export const config = getDefaultConfig({
  appName: "GiveAway3",
  projectId: Id,
  chains: [polygonMumbai, fantomTestnet, arbitrumSepolia],
});
