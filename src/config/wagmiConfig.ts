import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai, fantomTestnet } from "@wagmi/core/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const Id = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

export const arbitrumSepolia = {
  id: 421614,
  name: "Arbitrum Sepolia",
  network: "arbitrum",
  nativeCurrency: {
    decimals: 18,
    name: "Arbitrum Sepolia Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [] },
    default: { http: ["https://sepolia-rollup.arbitrum.io/rpc"] },
  },
  blockExplorers: {
    default: { name: "Arbiscan", url: "https://sepolia.arbiscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 81930,
    },
  },
  testnet: true,
} as const satisfies Chain;

const { chains, publicClient } = configureChains(
  [polygonMumbai, arbitrumSepolia, fantomTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "GiveAway3",
  projectId: Id,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const configWagmi = {
  wagmiConfig,
  chains,
};
