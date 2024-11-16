"use server"

import { readdir, readFile } from "fs/promises"

import { Course } from "@/types/course"

export const getAllCourses = async () => {
  const courses: Course[] = await readdir("../content").then((folder) => {
    return Promise.all(
      folder.map(async (courseId) => {
        const json = await readFile(
          `../content/${courseId}/metadata.json`,
          "utf8"
        ).then(JSON.parse)
        return { ...json, id: courseId }
      })
    )
  })

  return courses
}

export const getAllCoursesIds = async () => {
  const courses = await readdir("../content")
  return courses
}

export const getCourse = async (id?: string) => {
  try {
    if (!id) return null
    const course = await readFile(
      `../content/${id}/metadata.json`,
      "utf8"
    ).then(JSON.parse)

    return { ...course, id } as Course
  } catch (e) {
    return null
  }
}

export const getCourseContent = async (id?: string) => {
  try {
    if (!id) return null
    const content = await readFile(`../content/${id}/content.md`, "utf8")

    return {
      title: new RegExp(/^# (.*)$/m).exec(content)?.[1],
      sections: [...content.matchAll(new RegExp(/^## (.*)/gm))].map(
        (m) => m[1]
      ),
      content,
    }
  } catch (e) {
    return null
  }
}

export const getCourseContentBySectionIndex = async (
  id: string,
  index: number
) => {
  const content = await readFile(`../content/${id}/content.md`, "utf8")
  const sections = [...content.matchAll(new RegExp(/^## (.*)/gm))].map(
    (m) => m[1]
  )
  const section = sections[index]
  const start = content.indexOf(`## ${section}`)
  const end =
    index === sections.length - 1
      ? content.length
      : content.indexOf(`## ${sections[index + 1]}`)
  return {
    section,
    content: content.slice(start, end),
    hasNext: index < sections.length - 1,
    hasPrev: index > 0,
  }
}
