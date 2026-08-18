import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const components = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-8 mb-3 font-mono text-lg font-semibold text-foreground">
      {children}
    </h2>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-mono font-semibold text-foreground">
      {children}
    </strong>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-primary">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="text-terminal-foreground mb-4 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-4 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="text-sm leading-relaxed text-muted-foreground">
      {children}
    </li>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-4 border-l-2 border-primary pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
