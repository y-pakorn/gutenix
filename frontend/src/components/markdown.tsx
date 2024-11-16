import RMD, { Components } from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
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
    <TableCaption className={props.className} style={props.style}>
      {props.children}
    </TableCaption>
  ),
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "")

    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        PreTag="div"
        language={match[1]}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
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
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      className={cn(
        "prose min-w-full whitespace-normal text-primary dark:prose-invert prose-headings:text-primary prose-h2:text-4xl prose-h3:text-2xl prose-p:text-base",
        className
      )}
      components={MDX_COMPONENTS}
    >
      {children}
    </RMD>
  )
}
