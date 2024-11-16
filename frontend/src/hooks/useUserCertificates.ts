import { useQuery } from "@tanstack/react-query"
import _ from "lodash"
import { fromHex } from "viem"
import { useAccount, usePublicClient } from "wagmi"

import { Certificate } from "@/types/certificate"
import { CERTIFICATE_ABI, getCertificateId } from "@/lib/certificate"
import { getAllCoursesIds } from "@/services/course"

import { useChain } from "./useChain"

export const useUserCertificates = (suffix?: string) => {
  const account = useAccount()
  const client = usePublicClient()
  const chain = useChain()
  const data = useQuery({
    queryKey: ["user-certificates", account.address, chain.id, suffix],
    queryFn: async () => {
      if (!account.address) return null
      const courseIds = await getAllCoursesIds()
      const contract = _.chain(
        await Promise.all(
          courseIds.map(async (courseId) => {
            const certificate = await client
              .readContract({
                abi: CERTIFICATE_ABI,
                address: chain.certificate,
                functionName: "getCertificateInfo",
                args: [
                  fromHex(
                    getCertificateId(
                      account.address!,
                      suffix ? `${courseId}${suffix}` : courseId
                    ),
                    "bigint"
                  ),
                ],
              })
              .catch(() => undefined)
            if (!certificate) return
            const [
              certificateId,
              issueTimestamp,
              expiryTimestamp,
              status,
              level,
            ] = certificate
            return {
              certificateId,
              issueTimestamp: Number(issueTimestamp),
              expiryTimestamp: Number(expiryTimestamp),
              status,
              level,
            }
          })
        )
      )
        .compact()
        .value()
      return contract as Certificate[]
    },
  })

  return data
}
