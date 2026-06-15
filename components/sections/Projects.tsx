"use client"
import { motion } from "framer-motion"
import { ExternalLink, GitBranch } from "lucide-react"
import { projects } from "@/lib/content"
import { MagneticCard } from "@/components/fx/MagneticCard"
import { StatusDot } from "@/components/fx/StatusDot"

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              // 03 · projects
            </p>
            <h2
              id="projects-heading"
              className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              things i've shipped
            </h2>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            $ ls -la ~/projects
          </span>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <MagneticCard className="h-full">
                <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--primary)_30%,transparent)]">
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-mono text-lg font-medium text-foreground">
                      <span className="text-muted-foreground">./</span>
                      {p.title}
                    </h3>
                    <StatusDot status={p.status} />
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center gap-2">
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} repository`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <GitBranch className="size-3.5" /> repo
                      </a>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} live`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <ExternalLink className="size-3.5" /> live
                      </a>
                    )}
                  </div>
                </div>
              </MagneticCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
