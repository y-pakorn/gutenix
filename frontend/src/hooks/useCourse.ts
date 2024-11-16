import { useQuery } from "@tanstack/react-query"

import { getCourse } from "@/services/course"

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course-metadata", courseId],
    queryFn: async () => {
      return getCourse(courseId)
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  })
}
