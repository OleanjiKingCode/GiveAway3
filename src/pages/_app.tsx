import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { Toaster } from "@/components/ui/toaster";
import { configWagmi } from "@/config/wagmiConfig";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={configWagmi.wagmiConfig}>
      <RainbowKitProvider
        chains={configWagmi.chains}
        theme={lightTheme({
          accentColor: "#dcaac7",
          accentColorForeground: "white",
        })}
      >
        <Component {...pageProps} />
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
