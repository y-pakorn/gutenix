export type SectionQuiz = {
  question_type: "multiple_choice" | "open_ended"
  question: string
  choices?: string[]
  answer: string
}

export type OpenEndedQuizGrading = {
  result: "correct" | "partially_correct" | "incorrect"
  feedback: string
}
