import { createConfig } from "@privy-io/wagmi"
import { bitkubTestnet, sepolia } from "viem/chains"
import { http } from "wagmi"

import { supportedChains } from "./chains"

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}

export const config = createConfig({
  ssr: true,
  chains: supportedChains,
  transports: {
    [sepolia.id]: http(),
    [bitkubTestnet.id]: http(),
  },
  batch: {
    multicall: {
      wait: 150,
    },
  },
})
