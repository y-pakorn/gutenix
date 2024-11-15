import { readdir, readFile } from "fs/promises"
import Link from "next/link"
import _ from "lodash"

import { Course } from "@/types/course"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

import { CourseFilterSidebar } from "./course-filter"

export default async function Home({
  searchParams: __,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await __
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
        <h1 className="text-xl font-bold">{siteConfig.name}</h1>
        <h1 className="text-5xl font-semibold">
          Future Of Education
          <br />
          Right In Your Hand
        </h1>
        <h2>Start learning now, faster and easier than ever before.</h2>
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
            <div
              key={course.id}
              className="flex cursor-pointer items-center gap-4 transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={course.cover_image}
                alt={course.title}
                className="aspect-video h-32 rounded-xl object-cover"
              />
              <div className="space-y-1">
                <h3 className="truncate text-xl font-semibold">
                  {course.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {course.author} | {course.level}
                </p>
                <p className="text-wrap text-sm">{course.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  {course.tags.map((tag) => (
                    <Badge variant="secondary">{_.startCase(tag)}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
