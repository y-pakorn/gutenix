import { createConfig } from "@privy-io/wagmi"
import {
  baseSepolia,
  bitkubTestnet,
  flowTestnet,
  lineaSepolia,
  morphSepolia,
  polygonAmoy,
  scrollSepolia,
  sepolia,
  zircuitTestnet,
} from "viem/chains"
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
    [polygonAmoy.id]: http(),
    [flowTestnet.id]: http(),
    [scrollSepolia.id]: http(),
    [zircuitTestnet.id]: http(),
    [baseSepolia.id]: http(),
    [morphSepolia.id]: http(),
    [lineaSepolia.id]: http(),
  },
  batch: {
    multicall: {
      wait: 150,
    },
  },
})
