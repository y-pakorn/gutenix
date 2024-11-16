import Link from "next/link"
import _ from "lodash"

import { siteConfig } from "@/config/site"
import { getAllCourses } from "@/services/course"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CourseFilterSidebar } from "@/components/course-filter"

export default async function Home({
  searchParams: __,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await __
  const courses = await getAllCourses()

  const categories = _.chain(courses)
    .map("category")
    .groupBy()
    .mapValues((value) => value.length)
    .value()
  const tags = _.chain(courses)
    .map("tags")
    .flatten()
    .groupBy()
    .mapValues((value) => value.length)
    .value()
  const levels = _.chain(courses)
    .map("level")
    .groupBy()
    .mapValues((value) => value.length)
    .value()

  const selectedCategories = searchParams["category"]
  const selectedTags = searchParams["tag"]
  const selectedLevels = searchParams["level"]

  const shownCourses = _.chain(courses)
    .filter((course) => {
      if (!selectedCategories) return true
      return _.isString(selectedCategories)
        ? course.category === selectedCategories
        : selectedCategories.includes(course.category)
    })
    .filter((course) => {
      if (!selectedTags) return true
      return _.isString(selectedTags)
        ? course.tags.includes(selectedTags)
        : selectedTags.some((tag) => course.tags.includes(tag))
    })
    .filter((course) => {
      if (!selectedLevels) return true
      return _.isString(selectedLevels)
        ? course.level === selectedLevels
        : selectedLevels.includes(course.level)
    })
    .value()

  return (
    <main className="flex w-full flex-col px-8 py-8">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">
          {siteConfig.name} - The World University
        </h1>
        <h1 className="text-5xl font-semibold">
          From Those Who Have
          <br /> To Those Who Seek
        </h1>
        <h2 className="text-muted-foreground">
          Start learning now, faster and easier than ever before.
        </h2>
      </div>
      <Separator className="my-8" />
      <div className="flex gap-8">
        <CourseFilterSidebar
          className="w-44 shrink-0"
          categories={categories}
          tags={tags}
          levels={levels}
        />
        <div className="grid grid-cols-1 gap-4">
          {shownCourses.map((course) => (
            <Link
              href={`/course/${course.id}`}
              key={course.id}
              className="flex cursor-pointer items-center gap-4 transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={course.cover_image}
                alt={course.title}
                className="aspect-video h-32 rounded-xl object-cover"
              />
              <div className="space-y-2">
                <h3 className="truncate text-xl font-semibold">
                  {course.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {course.author} | {course.level}
                </p>
                <p className="text-wrap text-sm">{course.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  {course.tags.map((tag, i) => (
                    <Badge variant="secondary" key={i}>
                      {_.startCase(tag)}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
