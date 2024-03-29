import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import "../styles/globals.css";
import { config } from "@/config/wagmiConfig";
import { Toaster } from "@/components/ui/toaster";

const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#dcaac7",
            accentColorForeground: "white",
          })}
        >
          <Component {...pageProps} />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
