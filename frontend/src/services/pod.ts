"use server"

import { encodePrivateKey, POD, PODEntries } from "@pcd/pod"
import { createPublicClient, fromHex, Hex, http } from "viem"

import { env } from "@/env.mjs"
import { chains } from "@/config/chains"
import { CERTIFICATE_ABI } from "@/lib/certificate"

export const signPod = async (chainId: number, tokenId: Hex) => {
  const privateKey = encodePrivateKey(fromHex(env.PRIVATE_KEY as Hex, "bytes"))

  const chain = chains[chainId]
  const client = createPublicClient({
    chain,
    transport: http(),
  })
  const [certificateId, issueTimestamp, expiryTimestamp, status, level] =
    await client.readContract({
      address: chain.certificate,
      abi: CERTIFICATE_ABI,
      functionName: "getCertificateInfo",
      args: [fromHex(tokenId, "bigint")],
    })
  const owner = await client.readContract({
    address: chain.certificate,
    abi: CERTIFICATE_ABI,
    functionName: "ownerOf",
    args: [fromHex(tokenId, "bigint")],
  })

  const podEntries: PODEntries = {
    chainId: {
      type: "int",
      value: BigInt(chainId),
    },
    id: {
      type: "string",
      value: tokenId,
    },
    owner: {
      type: "string",
      value: owner,
    },
    certificateId: {
      type: "string",
      value: certificateId,
    },
    courseId: {
      type: "string",
      value: certificateId.split("-")[0],
    },
    courseType: {
      type: "string",
      value: certificateId.split("-")[1] || "",
    },
    issueTimestamp: {
      type: "date",
      value: new Date(Number(issueTimestamp) * 1000),
    },
    expiryTimestamp: {
      type: "date",
      value: new Date(Number(expiryTimestamp) * 1000),
    },
    status: {
      type: "int",
      value: BigInt(status),
    },
    level: {
      type: "int",
      value: BigInt(level),
    },
  }

  const pod = POD.sign(podEntries, privateKey)

  return pod.toJSON()
}
