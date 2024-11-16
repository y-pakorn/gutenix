export type SectionQuiz = {
  question_type: "multiple_choice" | "open_ended"
  question: string
  choices?: string[]
  answer: string
  hint: string
}

export type QuizGrading = {
  result: "correct" | "partially_correct" | "incorrect"
  feedback: string
}
