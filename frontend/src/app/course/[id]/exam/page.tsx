"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { SectionQuiz } from "@/types/quiz"
import { generateExamQuiz } from "@/services/ai"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
      <p className="text-muted-foreground">
        {"Let's see how much you've learned in this course. Good luck!"}
      </p>
      {quizes.data.map((quiz, i) => (
        <Quiz key={i} id={id} question={quiz} index={i} />
      ))}
      <div className="flex items-center gap-2">
        <Button>Confirm And Submit</Button>
      </div>
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
      <h1 className="text-xl font-bold">Quiz #{index + 1}</h1>
      <h2>{question.question}</h2>
      {question.question_type === "multiple_choice" ? (
        <RadioGroup
          className="grid grid-cols-2 gap-2"
          value={answer || undefined}
          onValueChange={setAnswer}
        >
          {question.choices?.map((choice, i) => (
            <div key={i} className="flex items-center gap-2">
              <RadioGroupItem value={choice} id={choice} />
              <Label htmlFor={choice}>{choice}</Label>
            </div>
          ))}
        </RadioGroup>
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
