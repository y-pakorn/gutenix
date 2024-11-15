"use server"

import { Address, encodePacked, keccak256, parseEther } from "viem"
import { signMessage } from "viem/accounts"

import { env } from "@/env.mjs"
import { Course } from "@/types/course"

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
  const value =
    stage === "access"
      ? parseEther(course?.access_price?.amount?.toString() || "0")
      : stage === "exam"
        ? parseEther(course?.exam_price?.amount?.toString() || "0")
        : 0n
  const message = keccak256(
    encodePacked(
      ["address", "string", "uint8", "uint256", "uint256"],
      [recipient, courseId, level, BigInt(validityPeriod), value]
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
  }
}
