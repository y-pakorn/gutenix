"use client"

import { useState } from "react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Check, Loader2, X } from "lucide-react"

import { SectionQuiz } from "@/types/quiz"
import { fireConfettiSide, fireSadEmojiAbove } from "@/lib/confetti"
import { generateCourseSectionQuiz } from "@/services/ai"
import { getCourseContentBySectionIndex } from "@/services/course"
import { Button } from "@/components/ui/button"
import { ConfettiButton } from "@/components/ui/confetti"
import { Separator } from "@/components/ui/separator"
import { Markdown } from "@/components/markdown"

export default function Page() {
  const params = useParams()
  const id = params.id as string
  const idx = parseInt(params.idx as string)

  const course = useQuery({
    queryKey: ["course-content", id, idx],
    queryFn: async () => {
      return getCourseContentBySectionIndex(id, idx)
    },
    staleTime: 1000 * 60 * 60 * 60,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const quiz = useQuery({
    queryKey: ["course-section-quiz", id, idx],
    queryFn: async () => {
      return generateCourseSectionQuiz(id, idx)
    },
    staleTime: 1000 * 60 * 60 * 60,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const router = useRouter()
  const pathname = usePathname()

  if (!course.data)
    return (
      <main className="flex w-full flex-col items-center justify-center px-8 py-8">
        {course.isLoading ? (
          <Loader2 className="size-8 animate-spin" />
        ) : (
          <h1 className="text-4xl font-bold">Course Not Found</h1>
        )}
      </main>
    )

  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <Markdown>{course.data.content}</Markdown>
      {quiz.data?.map((question, i) => (
        <Quiz key={i} question={question} index={i} />
      ))}
      <div className="flex items-center gap-2">
        {course.data.hasPrev && (
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/course/${id}/learn/${idx - 1}`)
            }}
          >
            Previous
          </Button>
        )}
        <div className="flex-1" />
        {course.data.hasNext && (
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/course/${id}/learn/${idx + 1}`)
            }}
          >
            Next
          </Button>
        )}
      </div>
    </main>
  )
}

function Quiz({ question, index }: { question: SectionQuiz; index: number }) {
  const [answer, setAnswer] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <h1 className="text-xl font-bold">Quiz #{index}</h1>
      <h2>{question.question}</h2>
      <div className="grid grid-cols-2 gap-2">
        {question.choices?.map((choice, i) => (
          <Button
            key={i}
            className="h-fit min-h-10 whitespace-pre-wrap rounded-md"
            onClick={() => {
              setAnswer((prev) => (prev === choice ? null : choice))
            }}
            variant={answer === choice ? "secondary" : "outline"}
            disabled={isSubmitted}
          >
            {choice}{" "}
            {answer === choice && isSubmitted && answer === question.answer && (
              <Check className="ml-2 size-4 rounded-full bg-green-500 p-1" />
            )}
            {answer === choice && isSubmitted && answer !== question.answer && (
              <X className="ml-2 size-4 rounded-full bg-red-500 p-1" />
            )}
          </Button>
        ))}
      </div>
      <div className="flex w-full justify-end gap-2">
        <Button
          variant="secondary"
          disabled={!isSubmitted || !answer}
          onClick={() => {
            setIsSubmitted(false)
            setAnswer(null)
          }}
        >
          Reset
        </Button>
        <Button
          disabled={!answer || isSubmitted}
          onClick={() => {
            setIsSubmitted(true)
            setAnswer(answer)
            if (answer === question.answer) {
              fireConfettiSide()
            } else {
              fireSadEmojiAbove()
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
