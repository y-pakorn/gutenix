import { readFile } from "fs/promises"
import { useParams } from "next/navigation"

import { getCourse } from "@/services/course"

export default async function Page(p: { params: Promise<{ id: string[] }> }) {
  const id = await p.params.then((p) => p.id?.[0])
  const course = await getCourse(id)

  if (!course)
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center px-8 py-8">
        <h1 className="text-4xl font-bold">Course Not Found</h1>
        <p className="text-lg">
          The course you are looking for does not exist.
        </p>
      </main>
    )

  return <main className="flex w-full flex-col px-8 py-8"></main>
}
