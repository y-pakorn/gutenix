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

    return { ...course, id }
  } catch (e) {
    return null
  }
}
