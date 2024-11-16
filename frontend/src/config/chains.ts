import { Address } from "viem"
import {
  baseSepolia,
  bitkubTestnet,
  Chain,
  flowTestnet,
  lineaSepolia,
  morphSepolia,
  polygonAmoy,
  scrollSepolia,
  sepolia,
  zircuitTestnet,
} from "viem/chains"

export const supportedChains = [
  sepolia,
  bitkubTestnet,
  polygonAmoy,
  flowTestnet,
  scrollSepolia,
  zircuitTestnet,
  baseSepolia,
  morphSepolia,
  lineaSepolia,
] as const
export const chains = {
  [sepolia.id]: {
    ...sepolia,
    icon: "https://cryptologos.cc/logos/versions/ethereum-eth-logo-diamond-purple.svg?v=035",
    certificate: "0xc50b929b314b3eb25500a35bfb316f151291c36c",
  },
  [bitkubTestnet.id]: {
    ...bitkubTestnet,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWAq1En4qP37TZ3ahnsZZYBiURq3iE6gCPwA&s",
    certificate: "0x1Bb37074F947B4be26c2bB9cB8E286bF447BA68f",
  },
  [polygonAmoy.id]: {
    ...polygonAmoy,
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
  [flowTestnet.id]: {
    ...flowTestnet,
    icon: "https://cryptologos.cc/logos/flow-flow-logo.png",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
  [scrollSepolia.id]: {
    ...scrollSepolia,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTtMWmmj_x1TEQJtBpOzkarPSZdIxZ23K-8w&s",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
  [zircuitTestnet.id]: {
    ...zircuitTestnet,
    icon: "https://assets.coingecko.com/articles/images/2101927/large/UPSCALED-Zircuit-Industry-Announcement-Featured-Image-Template.jpg?1731088848",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
  [baseSepolia.id]: {
    ...baseSepolia,
    icon: "https://images.mirror-media.xyz/publication-images/cgqxxPdUFBDjgKna_dDir.png?height=1200&width=1200",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
  [morphSepolia.id]: {
    ...morphSepolia,
    icon: "https://pbs.twimg.com/profile_images/1787467144914931712/3uIItkW0_400x400.jpg",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
  [lineaSepolia.id]: {
    ...lineaSepolia,
    icon: "https://automata-network.github.io/ata.lib/1rpc/networks/linea.svg",
    certificate: "0x1995ee7c84e01fe47a54d272a32e87ab84e59f32",
  },
} as Record<
  number,
  Chain & {
    icon: string
    certificate: Address
  }
>
