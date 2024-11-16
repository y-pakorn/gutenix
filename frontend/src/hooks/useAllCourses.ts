import { useQuery } from "@tanstack/react-query"

import { getAllCourses } from "@/services/course"

export const useAllCourses = () => {
  const data = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      return await getAllCourses()
    },
  })
  return data
}
