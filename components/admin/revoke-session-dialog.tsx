"use client"

import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { revokeSession } from "@/app/admin/(shell)/logs/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type RevokeSessionDialogProps = {
  sessionId: string
  sessionUser: string
}

export function RevokeSessionDialog({
  sessionId,
  sessionUser,
}: RevokeSessionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)

  const handleRevoke = async () => {
    setIsRevoking(true)
    const result = await revokeSession(sessionId)
    setIsRevoking(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setOpen(false)
    toast.success(result.message)
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 px-2.5 py-1.5 font-mono text-xs text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-3.5" /> revoke
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-card font-mono">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-foreground">
            <span className="text-destructive">$ revoke</span> session/
            {sessionUser}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs leading-relaxed text-muted-foreground">
            This immediately invalidates the selected login session. The
            affected administrator must sign in again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRevoking} className="font-mono">
            cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRevoking}
            onClick={handleRevoke}
            className="text-destructive-foreground gap-2 bg-destructive font-mono hover:bg-destructive/90"
          >
            {isRevoking ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            {isRevoking ? "revoking..." : "revoke session"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
