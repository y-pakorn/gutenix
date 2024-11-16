"use server"

import { Address, encodePacked, keccak256, parseEther } from "viem"
import { signMessage } from "viem/accounts"

import { env } from "@/env.mjs"

import { getCourse } from "./course"

export const getMintSignature = async (
  recipient: Address,
  courseId: string,
  level: number,
  validityPeriod: bigint,
  stage: "access" | "exam" | "exam_result"
) => {
  const course = await getCourse(courseId)
  if (!course) throw new Error("Course not found")
  const id =
    stage === "access"
      ? courseId
      : stage === "exam"
        ? `${courseId}-exam`
        : `${courseId}-certificate`
  const value =
    stage === "access"
      ? parseEther(course?.access_price?.amount?.toString() || "0")
      : stage === "exam"
        ? parseEther(course?.exam?.price?.amount?.toString() || "0")
        : 0n
  const message = keccak256(
    encodePacked(
      ["address", "string", "uint8", "uint256", "uint256"],
      [recipient, id, level, validityPeriod, value]
    )
  )

  return {
    signature: await signMessage({
      message: {
        raw: message,
      },
      privateKey: env.PRIVATE_KEY as Address,
    }),
    value,
    id,
  }
}
