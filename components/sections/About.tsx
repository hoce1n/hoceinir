"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw } from "lucide-react"
import { TerminalWindow } from "@/components/terminal/TerminalWindow"
import { Prompt } from "@/components/terminal/Prompt"
import { LiveStatus } from "@/components/fx/LiveStatus"
import { InlineText } from "@/components/fx/InlineText"
import type { AboutData } from "@/lib/data/content"

export function About({ data }: { data: AboutData }) {
  const [run, setRun] = useState(0)

  const lines = [
    { p: "./bio.sh --verbose", out: null },
    { p: null, out: "[ok] loading developer profile..." },
    { p: null, out: `name        : ${data.name}` },
    { p: null, out: `role        : ${data.role}` },
    { p: null, out: `loves       : ${data.loves}` },
    { p: null, out: `currently   : ${data.currently}` },
    { p: null, out: `philosophy  : ${data.philosophy}` },
    { p: null, out: "[done] exit 0" },
  ]

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              {"// 01 · about"}
            </p>
            <h2
              id="about-heading"
              className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              who is <span className="text-primary">{data.name}</span>?
            </h2>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            {data.paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                <InlineText text={p} />
              </p>
            ))}

            <dl className="grid grid-cols-3 gap-3 pt-2">
              {data.stats.map((s) => (
                <div
                  key={s.k}
                  className="rounded-lg border border-border bg-card/50 p-4"
                >
                  <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {s.k}
                  </dt>
                  <dd className="mt-1 font-mono text-2xl text-primary">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setRun((r) => r + 1)}
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/15"
            >
              {run === 0 ? (
                <Play className="size-4" />
              ) : (
                <RotateCcw className="size-4" />
              )}
              {run === 0 ? "execute bio.sh" : "re-run"}
            </button>
          </div>

          <TerminalWindow title="bio.sh">
            <AnimatePresence mode="wait">
              <motion.div key={run} className="space-y-1.5">
                {lines.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.18, duration: 0.25 }}
                  >
                    {l.p ? (
                      <Prompt>{l.p}</Prompt>
                    ) : (
                      <div className="pl-4 text-foreground">
                        <span className="text-muted-foreground">{">"}</span>{" "}
                        {l.out}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </TerminalWindow>
        </div>

        <div className="mt-10">
          <LiveStatus />
        </div>
      </div>
    </section>
  )
}
