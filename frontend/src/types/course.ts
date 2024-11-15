import { Address } from "viem"

export type Course = {
  id: string
  title: string
  description: string
  cover_image: string
  category: string
  tags: string[]
  author: string
  level: "Basic" | "Intermediate" | "Advanced" | "Expert" | "All Level"
  access_price?: {
    amount: number
    recipient: Address
  }
  has_exam?: boolean
  exam_price?: {
    amount: number
    recipient: Address
  }
}
