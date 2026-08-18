import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { Prompt } from "@/components/terminal/Prompt"
import { TerminalWindow } from "@/components/terminal/TerminalWindow"

export default function NotFound() {
  return (
    <main className="dark flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <TerminalWindow
        title="zsh — hocein@dev:~/404"
        className="w-full max-w-2xl"
        bodyClassName="space-y-6 sm:p-7"
      >
        <div className="flex items-center gap-3 text-primary">
          <FileQuestion className="size-5" />
          <Prompt>cat requested-route</Prompt>
        </div>
        <div className="border-l-2 border-destructive/70 pl-4">
          <p className="font-mono text-lg font-semibold text-foreground">
            404: no such file or directory
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The route you requested is not present in this filesystem. It may
            have moved, been removed, or never existed.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/5 px-4 py-2 font-mono text-xs tracking-wider text-primary transition-colors hover:border-primary hover:bg-primary/10"
        >
          <ArrowLeft className="size-3" /> cd ~/
        </Link>
      </TerminalWindow>
    </main>
  )
}
