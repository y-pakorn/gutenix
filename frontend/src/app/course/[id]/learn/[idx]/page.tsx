"use client"

import { useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import _ from "lodash"
import { Check, Loader2, X } from "lucide-react"

import { OpenEndedQuizGrading, SectionQuiz } from "@/types/quiz"
import { fireConfettiSide, fireSadEmojiAbove } from "@/lib/confetti"
import { cn } from "@/lib/utils"
import { generateCourseSectionQuiz, gradeQuiz } from "@/services/ai"
import { getCourseContentBySectionIndex } from "@/services/course"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
        <Quiz key={i} question={question} index={i} id={id} />
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [grade, setGrade] = useState<OpenEndedQuizGrading | null>(null)

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
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
              disabled={isSubmitted}
            >
              {choice}{" "}
              {answer === choice &&
                isSubmitted &&
                answer === question.answer && (
                  <Check className="ml-2 size-4 shrink-0 rounded-full bg-green-500 p-1" />
                )}
              {answer === choice &&
                isSubmitted &&
                answer !== question.answer && (
                  <X className="ml-2 size-4 shrink-0 rounded-full bg-red-500 p-1" />
                )}
            </Button>
          ))}
        </div>
      ) : (
        <Textarea
          value={answer || ""}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitted}
          placeholder="Type your answer here"
        />
      )}
      {question.question_type === "open_ended" && grade && (
        <div
          className={cn(
            grade.result === "correct" && "text-green-400",
            grade.result === "partially_correct" && "text-yellow-400",
            grade.result === "incorrect" && "text-red-400"
          )}
        >
          <div className="text-xl font-bold">{_.startCase(grade.result)}!</div>
          <div>{grade.feedback}</div>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        <Button
          variant="secondary"
          disabled={!isSubmitted || !answer}
          onClick={() => {
            setIsSubmitted(false)
            setAnswer(null)
            setGrade(null)
          }}
        >
          Reset
        </Button>
        <Button
          disabled={!answer || isSubmitted || isSubmitting}
          onClick={async () => {
            if (question.question_type === "multiple_choice") {
              setIsSubmitted(true)
              setAnswer(answer)
              if (answer === question.answer) {
                fireConfettiSide()
              } else {
                fireSadEmojiAbove()
              }
            } else {
              try {
                setIsSubmitting(true)
                const graded = await gradeQuiz(id, question, answer || "")
                if (
                  graded.result === "correct" ||
                  graded.result === "partially_correct"
                ) {
                  fireConfettiSide()
                } else {
                  fireSadEmojiAbove()
                }
                setGrade(graded)
                setIsSubmitted(true)
              } finally {
                setIsSubmitting(false)
              }
            }
          }}
        >
          Submit{" "}
          {isSubmitting && <Loader2 className="ml-2 size-4 animate-spin" />}
        </Button>
      </div>
    </div>
  )
}
