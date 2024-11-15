"use client"

import { useId } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import _ from "lodash"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

function FilterButton({
  label,
  isActive,
  count,
  onCheckedChange,
}: {
  label: string
  count?: number
  isActive?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const id = useId()
  return (
    <div
      className="mt-1 flex w-full cursor-pointer items-center gap-2"
      onClick={() => onCheckedChange?.(!isActive)}
    >
      <Checkbox id={id} checked={isActive} />
      <div className="text-sm">{_.startCase(label)}</div>
      {count && (
        <div className="ml-auto text-xs text-muted-foreground">({count})</div>
      )}
    </div>
  )
}

export function CourseFilterSidebar({
  categories,
  tags,
  levels,
  className,
}: {
  categories: { [key: string]: number }
  tags: { [key: string]: number }
  levels: { [key: string]: number }
  className?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold">Filters</h2>
      <div className="space-y-2">
        <h3 className="font-medium">Categories</h3>
        <ScrollArea className="flex max-h-24 flex-col overflow-y-auto">
          {Object.entries(categories).map(([category, count]) => (
            <FilterButton
              key={category}
              label={category}
              count={count}
              isActive={searchParams.has("category", category)}
              onCheckedChange={(checked) => {
                const params = new URLSearchParams(searchParams)
                if (checked) params.append("category", category)
                else params.delete("category", category)

                router.replace(`${pathname}?${params.toString()}`)
              }}
            />
          ))}
        </ScrollArea>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Tags</h3>
        <ScrollArea className="flex max-h-24 flex-col overflow-y-auto">
          {Object.entries(tags).map(([tag, count]) => (
            <FilterButton
              key={tag}
              label={tag}
              count={count}
              isActive={searchParams.has("tag", tag)}
              onCheckedChange={(checked) => {
                const params = new URLSearchParams(searchParams)
                if (checked) params.append("tag", tag)
                else params.delete("tag", tag)

                router.replace(`${pathname}?${params.toString()}`)
              }}
            />
          ))}
        </ScrollArea>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Levels</h3>
        <ScrollArea className="flex max-h-24 flex-col overflow-y-auto">
          {Object.entries(levels).map(([level, count]) => (
            <FilterButton
              key={level}
              label={level}
              count={count}
              isActive={searchParams.has("level", level)}
              onCheckedChange={(checked) => {
                const params = new URLSearchParams(searchParams)
                if (checked) params.append("level", level)
                else params.delete("level", level)

                router.replace(`${pathname}?${params.toString()}`)
              }}
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
