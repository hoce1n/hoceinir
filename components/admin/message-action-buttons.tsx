"use client"

import { useState } from "react"
import { Archive, Loader2, MailOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  archiveMessage,
  markMessageRead,
} from "@/app/admin/(shell)/messages/actions"

type MessageActionButtonsProps = {
  messageId: string
  status: "NEW" | "READ" | "ARCHIVED"
  compact?: boolean
}

export function MessageActionButtons({
  messageId,
  status,
  compact = false,
}: MessageActionButtonsProps) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<"read" | "archive" | null>(
    null
  )

  const runAction = async (action: "read" | "archive") => {
    setPendingAction(action)
    const result =
      action === "read"
        ? await markMessageRead(messageId)
        : await archiveMessage(messageId)
    setPendingAction(null)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(result.message)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "NEW" ? (
        <button
          type="button"
          disabled={pendingAction !== null}
          onClick={() => runAction("read")}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingAction === "read" ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <MailOpen className="size-3.5" />
          )}
          {compact ? "read" : "mark read"}
        </button>
      ) : null}
      {status !== "ARCHIVED" ? (
        <button
          type="button"
          disabled={pendingAction !== null}
          onClick={() => runAction("archive")}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingAction === "archive" ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Archive className="size-3.5" />
          )}
          {compact ? "archive" : "archive"}
        </button>
      ) : null}
    </div>
  )
}
