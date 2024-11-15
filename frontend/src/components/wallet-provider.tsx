"use client"

import { ReactNode } from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { WagmiProvider } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

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
          loginMessage: "Login or create an account to get started",
          walletChainType: "ethereum-only",
          showWalletLoginFirst: true,
        },
        defaultChain: supportedChains[0],
        loginMethods: ["email", "wallet", "google", "apple", "farcaster"],
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
