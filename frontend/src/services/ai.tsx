"use server"

import { readFile } from "fs/promises"
import { unstable_cache } from "next/cache"
import { generateObject, generateText } from "ai"
import { z } from "zod"

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
        .replaceAll("{difficulty}", "easy")
        .replaceAll("{objective}", "understanding")
        .replaceAll("{content}", content.content)
        .replaceAll("{total_questions}", "2")
        .replaceAll(
          "{context}",
          `Generate based on this section of the content:
${sectionContent}`
        ),
    })

    return object
  },
  undefined,
  {
    revalidate: 60 * 60 * 24 * 7,
    tags: ["course-section-quiz"],
  }
)
