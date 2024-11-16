import { useMemo } from "react"
import { useChainId } from "wagmi"

import { chains } from "@/config/chains"

export const useChain = () => {
  const chainId = useChainId()
  const chain = useMemo(() => chains[chainId], [chainId])

  return chain
}
