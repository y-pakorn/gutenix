import { getCourse, getCourseContent } from "@/services/course"

import { CourseCover } from "./course-cover"

export default async function Page(p: { params: Promise<{ id: string }> }) {
  const id = await p.params.then((p) => p.id)
  const course = await getCourse(id)
  const content = await getCourseContent(id)

  if (!course || !content)
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center px-8 py-8">
        <h1 className="text-4xl font-bold">Course Not Found</h1>
        <p className="text-lg">
          The course you are looking for does not exist.
        </p>
      </main>
    )

  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <CourseCover course={course} sections={content.sections} />
    </main>
  )
}
