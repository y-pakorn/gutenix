import { useMemo } from "react"
import { Chain } from "viem"
import { useChainId } from "wagmi"

import { chains } from "@/config/web3"

export const useChain = () => {
  const chainId = useChainId()
  const chain = useMemo(() => chains[chainId], [chainId])

  return chain
}
