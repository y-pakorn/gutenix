import { useMemo } from "react"
import { Address, fromHex } from "viem"
import { useAccount, useReadContract } from "wagmi"

import { CERTIFICATE_ABI, getCertificateId } from "@/lib/certificate"

import { useChain } from "./useChain"

export const useCertificate = (courseId: string) => {
  const chain = useChain()
  const account = useAccount()
  const data = useReadContract({
    address: chain.certificate,
    abi: CERTIFICATE_ABI,
    functionName: "getCertificateInfo",
    args: account.address
      ? [fromHex(getCertificateId(account.address, courseId), "bigint")]
      : undefined,
    query: {
      retry: false,
    },
  })

  const certificate = useMemo(() => {
    if (!data.data) return null
    const [certificateId, issueTimestamp, expiryTimestamp, status, level] =
      data.data
    return {
      certificateId,
      issueTimestamp: Number(issueTimestamp),
      expiryTimestamp: Number(expiryTimestamp),
      status,
      level,
    }
  }, [data.data])

  return { certificate, ...data }
}
