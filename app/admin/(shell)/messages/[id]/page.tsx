import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Mail } from "lucide-react"
import { MessageActionButtons } from "@/components/admin/message-action-buttons"
import { MessageDeleteDialog } from "@/components/admin/message-delete-dialog"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

type MessageDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function MessageDetailPage({
  params,
}: MessageDetailPageProps) {
  await requireAdmin()
  const { id } = await params
  const message = await db.contactMessage.findUnique({ where: { id } })

  if (!message) notFound()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> cd /var/log/messages
      </Link>

      <header className="mt-5 border-b border-border pb-6">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {"// messages · detail"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          ./{message.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="size-3.5" /> {message.email}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />{" "}
            {message.createdAt.toISOString().slice(0, 16).replace("T", " ")}
          </span>
          <MessageStatusBadge status={message.status} />
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> cat /var/log/messages/
            {message.id}
          </p>
        </div>
        <article className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-foreground sm:p-6">
          {message.message}
        </article>
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4 sm:px-6">
          <MessageActionButtons
            messageId={message.id}
            status={message.status}
          />
          <MessageDeleteDialog
            messageId={message.id}
            senderName={message.name}
          />
        </div>
      </section>
    </div>
  )
}

function MessageStatusBadge({
  status,
}: {
  status: "NEW" | "READ" | "ARCHIVED"
}) {
  const style = {
    NEW: "bg-primary shadow-[0_0_10px_var(--primary)]",
    READ: "bg-secondary shadow-[0_0_10px_var(--secondary)]",
    ARCHIVED: "bg-muted-foreground/60",
  } as const

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
      <span className={`size-2 rounded-full ${style[status]}`} />
      {status}
    </span>
  )
}
