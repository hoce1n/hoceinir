"use client"

import Link from "next/link"
import { RotateCcw } from "lucide-react"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="dark">
      <body className="m-0 min-h-screen bg-[#080d0a] font-mono text-[#e9f5ec]">
        <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
          <section className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-[#101713] shadow-2xl shadow-black/40">
            <header className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-300/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-white/55">
                sh — hocein@recovery:~/
              </span>
            </header>
            <div className="space-y-6 p-5 sm:p-7">
              <p className="text-sm text-emerald-300">$ boot --safe-mode</p>
              <div className="border-l-2 border-red-400/80 pl-4">
                <h1 className="text-lg font-semibold text-white">
                  segmentation fault: root layout unavailable
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  The application could not load its normal shell. Retry the
                  recovery command or navigate back to the home directory.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-md border border-emerald-400/60 bg-emerald-400/10 px-4 py-2 text-xs tracking-wider text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  <RotateCcw className="size-3" /> $ retry
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md border border-white/15 px-4 py-2 text-xs tracking-wider text-white/60 transition-colors hover:border-emerald-400/60 hover:text-emerald-200"
                >
                  cd ~/
                </Link>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}
