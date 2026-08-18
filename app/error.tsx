"use client"

import Link from "next/link"
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react"
import { Prompt } from "@/components/terminal/Prompt"
import { TerminalWindow } from "@/components/terminal/TerminalWindow"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="dark flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <TerminalWindow
        title="zsh — hocein@dev:~/runtime"
        className="w-full max-w-2xl"
        bodyClassName="space-y-6 sm:p-7"
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="size-5" />
          <Prompt>./render-page</Prompt>
        </div>
        <div className="border-l-2 border-destructive/70 pl-4">
          <p className="font-mono text-lg font-semibold text-foreground">
            process exited unexpectedly
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The route encountered a recoverable runtime error. Retry the command
            or return to a known-good directory.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/5 px-4 py-2 font-mono text-xs tracking-wider text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            <RotateCcw className="size-3" /> $ retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-xs tracking-wider text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <ArrowLeft className="size-3" /> cd ~/
          </Link>
        </div>
      </TerminalWindow>
    </main>
  )
}
