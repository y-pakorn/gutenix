"use client"

import Link from "next/link"
import _ from "lodash"

import { Certificate } from "@/types/certificate"
import { VALIDITY_THRESHOLD } from "@/config/site"
import { dayjs } from "@/lib/dayjs"
import { useCourse } from "@/hooks/useCourse"
import { useUserCertificates } from "@/hooks/useUserCertificates"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const certs = useUserCertificates(`-certificate`)

  return (
    <main className="flex w-full flex-col gap-4 px-8 py-8">
      <h1 className="text-4xl font-bold">My Certificates</h1>
      <p className="text-muted-foreground">
        View all the certificates you have earned here.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certs.isLoading
          ? _.range(6).map((i) => (
              <Skeleton className="aspect-[1] w-full" key={i} />
            ))
          : certs.data?.map((certificate) => (
              <CertCard
                key={certificate.certificateId}
                certificate={certificate}
              />
            ))}
      </div>
    </main>
  )
}

function CertCard({ certificate }: { certificate: Certificate }) {
  const id = certificate.certificateId.split("-")[0]
  const { data: course } = useCourse(id)
  if (!course) return <Skeleton className="aspect-[1] w-full" />
  return (
    <div className="flex flex-col gap-1">
      <img
        src={course.cover_image}
        alt={course.title}
        className="aspect-video rounded-xl object-cover"
      />
      <h1 className="text-xl font-bold">{course.title} Certificate 👑</h1>
      <p className="line-clamp-2 text-xs">{course.description}</p>
      <p className="text-xs text-muted-foreground">
        Granted at {dayjs(certificate.issueTimestamp * 1000).fromNow()}
      </p>
      <p className="text-xs text-muted-foreground">
        {certificate.expiryTimestamp > VALIDITY_THRESHOLD
          ? "Valid Forever"
          : `Expires ${dayjs(certificate.expiryTimestamp * 1000).fromNow()}`}
        !
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
