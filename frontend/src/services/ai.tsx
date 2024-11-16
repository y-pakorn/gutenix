"use server"

import { readFile } from "fs/promises"
import { unstable_cache } from "next/cache"
import { generateObject } from "ai"
import { z } from "zod"

import { SectionQuiz } from "@/types/quiz"
import { model } from "@/config/ai"

import { getCourseContent } from "./course"

export const generateCourseSectionQuiz = unstable_cache(
  async (courseId: string, sectionIndex: number) => {
    const content = await getCourseContent(courseId)
    if (!content) throw new Error("Course not found")

    const section = content.sections[sectionIndex]
    if (!section) throw new Error("Section not found")

    const sectionContent = content.content.slice(
      content.content.indexOf(`## ${section}`),
      sectionIndex === content.sections.length - 1
        ? undefined
        : content.content.indexOf(`## ${content.sections[sectionIndex + 1]}`)
    )

    const prompt = await readFile(`../prompt/quiz_generator.txt`, "utf8")
    const { object } = await generateObject({
      model,
      schema: z.array(
        z.object({
          question_type: z.string(),
          question: z.string(),
          choices: z.array(z.string()).optional(),
          answer: z.string(),
        })
      ),
      mode: "json",
      prompt: prompt
        .replaceAll("{question_type}", "quiz")
        .replaceAll("{topic}", section)
        .replaceAll("{difficulty}", "intermediate")
        .replaceAll("{objective}", "understanding")
        .replaceAll("{content}", content.content)
        .replaceAll("{total_questions}", "2")
        .replaceAll(
          "{context}",
          `Generate based on this section of the content:
${sectionContent}`
        ),
    })

    return object as SectionQuiz[]
  },
  undefined,
  {
    revalidate: 60 * 60 * 24 * 7,
    tags: ["course-section-quiz"],
  }
)

export const gradeQuiz = async (
  courseId: string,
  quiz: SectionQuiz,
  answer: string
) => {
  const courseContent = await getCourseContent(courseId)
  if (!courseContent) throw new Error("Course not found")
  const prompt = await readFile(`../prompt/quiz_grader.txt`, "utf8")
  const { object } = await generateObject({
    model,
    mode: "json",
    schema: z.object({
      result: z.enum(["correct", "partially_correct", "incorrect"]),
      feedback: z.string(),
    }),
    prompt: prompt
      .replaceAll("{reference_content}", courseContent.content)
      .replaceAll("{question}", quiz.question)
      .replaceAll("{reference_answer}", quiz.answer)
      .replaceAll("{user_answer}", answer),
  })

  return object
}
