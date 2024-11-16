"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePublicClient, useReadContract, useWatchContractEvent } from "wagmi"

import { Certificate } from "@/types/certificate"
import { dayjs } from "@/lib/dayjs"
import { useCourse } from "@/hooks/useCourse"
import { useUserCertificates } from "@/hooks/useUserCertificates"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const certs = useUserCertificates()
  const ownedCourses = useMemo(() => {
    return (
      certs.data?.filter(
        (cert) => cert.certificateId.split("/").length === 1
      ) || []
    )
  }, [certs.data])

  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <h1 className="text-4xl font-bold">My Courses</h1>
      <p className="text-muted-foreground">
        View all the courses you have enrolled in here.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ownedCourses.map((certificate) => (
          <CourseCard
            key={certificate.certificateId}
            certificate={certificate}
          />
        ))}
      </div>
    </main>
  )
}

function CourseCard({ certificate }: { certificate: Certificate }) {
  const { data: course } = useCourse(certificate.certificateId)
  if (!course) return <Skeleton className="aspect-[1] w-full" />
  return (
    <div className="flex flex-col gap-1">
      <img
        src={course.cover_image}
        alt={course.title}
        className="aspect-video rounded-xl object-cover"
      />
      <h1 className="text-xl font-bold">{course.title}</h1>
      <p className="truncate text-xs text-muted-foreground">
        {course.author} | {course.level}
      </p>
      <p className="line-clamp-2 text-xs">{course.description}</p>
      <p className="text-xs text-muted-foreground">
        Started at {dayjs(certificate.issueTimestamp * 1000).fromNow()}
      </p>

      <div className="flex-1" />
      <Link href={`/course/${certificate.certificateId}`}>
        <Button variant="outline" size="sm" className="mt-2 w-full">
          Go To Course
        </Button>
      </Link>
    </div>
  )
}
