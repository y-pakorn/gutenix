export type Course = {
  id: string
  title: string
  description: string
  cover_image: string
  category: string
  tags: string[]
  author: string
  level: "Basic" | "Intermediate" | "Advanced" | "Expert" | "All Level"
}
