import { LoaderCircle } from "lucide-react"
import { Prompt } from "@/components/terminal/Prompt"
import { TerminalWindow } from "@/components/terminal/TerminalWindow"

export default function Loading() {
  return (
    <main className="dark flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <TerminalWindow
        title="zsh — hocein@dev:~/loading"
        className="w-full max-w-xl"
      >
        <div className="flex items-center gap-3 text-primary">
          <LoaderCircle className="size-4 animate-spin" />
          <Prompt>fetch --page</Prompt>
        </div>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          loading route
          <span className="caret-blink ml-1 inline-block h-[1em] w-[0.55ch] -translate-y-[2px] bg-primary align-middle" />
        </p>
      </TerminalWindow>
    </main>
  )
}
