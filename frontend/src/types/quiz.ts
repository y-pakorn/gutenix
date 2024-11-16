export type SectionQuiz = {
  question_type: "multiple_choice" | "open_ended" | string
  question: string
  choices?: string[]
  answer: string
}
