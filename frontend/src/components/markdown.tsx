import RMD, { Components } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { cn } from "@/lib/utils"

import { Separator } from "./ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

const MDX_COMPONENTS: Partial<Components> = {
  hr: (props) => <Separator {...props} className="my-8" />,
  blockquote: (props) => (
    <blockquote {...props} className="my-4 border-l-4 border-border pl-4" />
  ),
  table: (props) => (
    <div className="rounded-md border">
      <Table {...props} className={cn("my-0", props.className)} />
    </div>
  ),
  tr: (props) => (
    <TableRow {...props} className={cn("border-border", props.className)} />
  ),
  thead: (props) => <TableHeader {...props} />,
  td: (props) => <TableCell {...props} />,
  th: (props) => (
    <TableHead {...props} className={cn("py-0", props.className)} />
  ),
  tbody: (props) => <TableBody {...props} />,
  tfoot: (props) => <TableFooter {...props} />,
  caption: (props) => (
    <TableCaption className={props.className} children={props.children} />
  ),
} as const

export function Markdown({
  children,
  className,
}: {
  children?: string | null
  className?: string
}) {
  return (
    <RMD
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      className={cn(
        "prose dark:prose-invert prose-headings:text-primary min-w-full whitespace-normal text-primary",
        className
      )}
      components={MDX_COMPONENTS}
    >
      {children}
    </RMD>
  )
}
