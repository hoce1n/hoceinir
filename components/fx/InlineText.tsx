import { Fragment } from "react"

export function InlineText({
  text,
  codeClassName = "font-mono text-foreground",
}: {
  text: string
  codeClassName?: string
}) {
  const parts = text.split("`")
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={codeClassName}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}
