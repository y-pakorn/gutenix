"use client"

import { useCallback, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import _ from "lodash"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Hex } from "viem"
import { waitForTransactionReceipt } from "viem/actions"
import { useAccount, useClient, useWriteContract } from "wagmi"

import { QuizGrading, SectionQuiz } from "@/types/quiz"
import { VALIDITY_THRESHOLD } from "@/config/site"
import { CERTIFICATE_ABI } from "@/lib/certificate"
import { fireConfettiSide, fireSadEmojiAbove } from "@/lib/confetti"
import { cn } from "@/lib/utils"
import { useChain } from "@/hooks/useChain"
import { generateExamQuiz, gradeExam } from "@/services/ai"
import { getCourse } from "@/services/course"
import { getMintSignature } from "@/services/signature"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [grades, setGrades] = useState<QuizGrading["result"][]>([])
  const [sig, setSig] = useState<{
    signature: Hex
    value: bigint
    id: string
    validity: bigint
    level: number
  } | null>(null)

  const account = useAccount()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const submit = useCallback(async () => {
    if (!quizes.data) return
    if (!account.address) return

    try {
      setIsSubmitting(true)

      const course = await getCourse(id)
      if (!course) return

      const hasAllAnswered = quizes.data.every((_, i) => answers[i])
      if (!hasAllAnswered) {
        toast.error("Please answer all questions before submitting.")
        return
      }

      const grade = await gradeExam(id, quizes.data, answers)

      const demoMode =
        answers[quizes.data.length - 1] === "demo mode" ||
        answers[quizes.data.length - 2] === "demo mode"
      if (
        _.every(grade, (g) => g === "correct" || g === "partially_correct") ||
        // demo mode for testing
        demoMode
      ) {
        fireConfettiSide()

        const level = 0
        const validity = course.exam?.validity
          ? BigInt(course.exam.validity)
          : 1000000000000n
        const sig = await getMintSignature(
          account.address,
          id,
          level,
          validity,
          "exam_result"
        )
        setSig({ ...sig, validity, level })
        setOpen(true)
      } else {
        fireSadEmojiAbove()
      }

      if (demoMode) setGrades(grade.map(() => "correct"))
      else setGrades(grade)

      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, quizes.data])

  const client = useClient() as any
  const { writeContractAsync } = useWriteContract()

  const chain = useChain()
  const router = useRouter()

  const [isMinting, setIsMinting] = useState(false)
  const mintCertificate = async () => {
    if (!sig) return
    if (!account.address) return

    try {
      setIsMinting(true)

      const txHash = await writeContractAsync({
        abi: CERTIFICATE_ABI,
        address: chain.certificate,
        functionName: "mint",
        args: [
          account.address,
          sig.id,
          sig.level,
          sig.validity,
          sig.value,
          sig.signature,
        ],
        value: sig.value,
      })
      const receipt = await waitForTransactionReceipt(client, {
        hash: txHash,
      })

      if (receipt.status === "reverted") {
        toast.error("Transaction failed", {
          description: `Transaction hash: ${txHash}`,
        })
        return
      }

      toast.success("Congratulations!", {
        description: `Transaction hash: ${txHash}`,
      })
      router.push(`/course/${id}`)
    } finally {
      setIsMinting(false)
    }
  }

  const [open, setOpen] = useState(false)

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogDescription>
            You have successfully passed the exam. Your certificate is being
            minted. This certificate is valid for{" "}
            {sig && sig.validity >= VALIDITY_THRESHOLD
              ? dayjs
                  .duration({
                    seconds: Number(sig.validity),
                  })
                  .format()
              : "forever"}
            !
          </DialogDescription>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={mintCertificate}
              disabled={isMinting}
            >
              Mint Certificate{" "}
              {isMinting && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
      <main className="flex w-full flex-col gap-4 px-8 py-8">
        <h1 className="text-4xl font-bold">Exam</h1>
        <p className="text-muted-foreground">
          {"Let's see how much you've learned in this course. Good luck!"}
        </p>
        {quizes.data.map((quiz, i) => (
          <Quiz
            key={i}
            question={quiz}
            index={i}
            onAnswerChange={(answer) => setAnswers({ ...answers, [i]: answer })}
            answer={answers[i]}
            isSubmitted={isSubmitted}
            grade={grades[i]}
          />
        ))}
        <div className="flex items-center gap-2">
          <Button onClick={submit} disabled={isSubmitting || isSubmitted}>
            Confirm And Submit{" "}
            {isSubmitting && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
          {isSubmitted && (
            <Button
              variant="secondary"
              onClick={() => {
                setIsSubmitted(false)
                setGrades([])
                setAnswers({})
              }}
            >
              Retake
            </Button>
          )}
        </div>
      </main>
    </Dialog>
  )
}

function Quiz({
  question,
  index,
  onAnswerChange,
  answer,
  grade,
  isSubmitted,
}: {
  question: SectionQuiz
  index: number
  onAnswerChange: (answer: string) => void
  answer?: string
  isSubmitted?: boolean
  grade?: QuizGrading["result"]
}) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-md border p-4">
      <h1 className="text-xl font-bold">Quiz #{index + 1}</h1>
      <h2>{question.question}</h2>
      {question.question_type === "multiple_choice" ? (
        <RadioGroup
          className="grid grid-cols-2 gap-2"
          value={answer}
          onValueChange={onAnswerChange}
          disabled={isSubmitted}
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
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here"
          disabled={isSubmitted}
        />
      )}
      {isSubmitted && grade && (
        <h3
          className={cn(
            "text-xl font-bold",
            grade === "correct" && "text-green-400",
            grade === "partially_correct" && "text-yellow-400",
            grade === "incorrect" && "text-red-400"
          )}
        >
          {_.startCase(grade)}
        </h3>
      )}
    </div>
  )
}
