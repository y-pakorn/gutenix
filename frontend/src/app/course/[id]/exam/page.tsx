"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { SectionQuiz } from "@/types/quiz"
import { generateExamQuiz } from "@/services/ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  const quizes = useQuery({
    queryKey: ["course-quiz", id],
    queryFn: async () => {
      return generateExamQuiz(id)
    },
    staleTime: 60 * 60 * 60,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  if (!quizes.data)
    return (
      <main className="flex w-full flex-col items-center justify-center px-8 py-8">
        {quizes.isLoading ? (
          <Loader2 className="size-8 animate-spin" />
        ) : (
          <h1 className="text-4xl font-bold">Course Not Found</h1>
        )}
      </main>
    )

  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <h1 className="text-4xl font-bold">Exam</h1>
      <p>{"Let's see how much you've learned in this course. Good luck!"}</p>
      {quizes.data.map((quiz, i) => (
        <Quiz key={i} id={id} question={quiz} index={i} />
      ))}
    </main>
  )
}

function Quiz({
  id,
  question,
  index,
}: {
  id: string
  question: SectionQuiz
  index: number
}) {
  const [answer, setAnswer] = useState<string | null>(null)

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border p-4">
      <h1 className="text-xl font-bold">Quiz #{index}</h1>
      <h2>{question.question}</h2>
      {question.question_type === "multiple_choice" ? (
        <div className="grid grid-cols-2 gap-2">
          {question.choices?.map((choice, i) => (
            <Button
              key={i}
              className="h-fit min-h-10 whitespace-pre-wrap rounded-md"
              onClick={() => {
                setAnswer((prev) => (prev === choice ? null : choice))
              }}
              variant={answer === choice ? "secondary" : "outline"}
            >
              {choice}
            </Button>
          ))}
        </div>
      ) : (
        <Textarea
          value={answer || ""}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here"
        />
      )}
    </div>
  )
}
