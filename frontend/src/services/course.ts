import { readdir, readFile } from "fs/promises"

import { Course } from "@/types/course"

export const getAllCourses = async () => {
  "use server"
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

export const getCourse = async (id?: string) => {
  "use server"
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
  "use server"
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
