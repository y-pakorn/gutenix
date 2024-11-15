"use client"

import { usePathname } from "next/navigation"

export function CourseFilter() {
  const pathname = usePathname()
  const searchParams = new URLSearchParams(pathname)

  return <div className="flex items-center gap-2"></div>
}
