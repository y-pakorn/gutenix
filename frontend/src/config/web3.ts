import { createConfig } from "@privy-io/wagmi"
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
  },
  [bitkubTestnet.id]: {
    ...bitkubTestnet,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWAq1En4qP37TZ3ahnsZZYBiURq3iE6gCPwA&s",
  },
} as Record<
  number,
  Chain & {
    icon: string
  }
>

export const config = createConfig({
  chains: supportedChains,
  transports: {
    [sepolia.id]: http(),
    [bitkubTestnet.id]: http(),
  },
})
