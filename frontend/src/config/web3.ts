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
    certificate: "0xb68970cdbcf04dd75059e17ca14a9fea3523b5c7",
  },
  [bitkubTestnet.id]: {
    ...bitkubTestnet,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWAq1En4qP37TZ3ahnsZZYBiURq3iE6gCPwA&s",
    certificate: "0x1995eE7C84E01fe47A54D272a32e87Ab84E59F32",
  },
} as Record<
  number,
  Chain & {
    icon: string
    certificate: Address
  }
>

export const config = createConfig({
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
