"use client"

import { ReactNode } from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { config, supportedChains } from "@/config/web3"

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId="cm3j4syls002to5rdhontpe45"
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          waitForTransactionConfirmation: true,
        },
        supportedChains: [...supportedChains],
        appearance: {
          landingHeader: `Welcome to ${siteConfig.name}`,
          walletChainType: "ethereum-only",
          showWalletLoginFirst: true,
          logo: `${env.NEXT_PUBLIC_APP_URL}/icon_name.png`,
        },
        defaultChain: supportedChains[0],
        loginMethods: ["email", "wallet", "google", "farcaster"],
        loginMethodsAndOrder: {
          primary: [
            "email",
            "google",
            "farcaster",
            "rabby_wallet",
            "metamask",
            "detected_wallets",
            "wallet_connect",
          ],
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
