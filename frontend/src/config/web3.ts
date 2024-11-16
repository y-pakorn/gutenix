import { createConfig } from "@privy-io/wagmi"
import { Address } from "viem"
import { bitkubTestnet, Chain, sepolia } from "viem/chains"
import { http } from "wagmi"

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}

export const supportedChains = [sepolia, bitkubTestnet] as const
export const chains = {
  [sepolia.id]: {
    ...sepolia,
    icon: "https://cryptologos.cc/logos/versions/ethereum-eth-logo-diamond-purple.svg?v=035",
    certificate: "0xc50b929b314b3eb25500a35bfb316f151291c36c",
  },
  [bitkubTestnet.id]: {
    ...bitkubTestnet,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWAq1En4qP37TZ3ahnsZZYBiURq3iE6gCPwA&s",
    certificate: "0x",
  },
} as Record<
  number,
  Chain & {
    icon: string
    certificate: Address
  }
>

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
