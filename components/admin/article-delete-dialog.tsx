"use client"

import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteArticle } from "@/app/admin/(shell)/articles/actions"
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

type ArticleDeleteDialogProps = {
  articleId: string
  articleTitle: string
}

export function ArticleDeleteDialog({
  articleId,
  articleTitle,
}: ArticleDeleteDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteArticle(articleId)
    setIsDeleting(false)

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
          <Trash2 className="size-3.5" /> delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-card font-mono">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-foreground">
            <span className="text-destructive">$ rm -rf</span> ./{articleTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs leading-relaxed text-muted-foreground">
            This permanently removes{" "}
            <span className="text-foreground">{articleTitle}</span> from the
            article registry. This operation cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="font-mono">
            cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="text-destructive-foreground gap-2 bg-destructive font-mono hover:bg-destructive/90"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isDeleting ? "deleting..." : "delete article"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
