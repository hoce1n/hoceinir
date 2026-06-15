'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { Prompt } from "@/components/terminal/Prompt";
import { LiveStatus } from "@/components/fx/LiveStatus";

const lines = [
  { p: "./bio.sh --verbose", out: null },
  { p: null, out: "[ok] loading developer profile..." },
  { p: null, out: "name        : hocein" },
  { p: null, out: "role        : Full-Stack Dev / Linux SysAdmin" },
  { p: null, out: "loves       : Next.js, TS, Tailwind, Go, Prisma, Better-Auth" },
  { p: null, out: "currently   : tuning REST APIs, session cookies & cache layers" },
  { p: null, out: "philosophy  : ship neat, configure deeply, document later" },
  { p: null, out: "[done] exit 0" },
];

const stats = [
  { k: "stack pillars", v: "5+" },
  { k: "servers tamed", v: "30+" },
  { k: "coffee.lock", v: "held" },
];

export function About() {
  const [run, setRun] = useState(0);

  return (
    <section id="about" aria-labelledby="about-heading" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">// 01 · about</p>
            <h2 id="about-heading" className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
              who is <span className="text-primary">hocein</span>?
            </h2>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I'm a software developer with a strong passion for the{" "}
              <span className="font-mono text-foreground">Next.js</span> ecosystem (TypeScript +
              Tailwind), Go-powered API routes, and database orchestration via{" "}
              <span className="font-mono text-foreground">Prisma</span> across SQLite, MySQL, and
              PostgreSQL.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I obsess over auth done right —{" "}
              <span className="font-mono text-foreground">Better-Auth</span> sessions, HTTP-only
              cookies, and caching layers that keep REST endpoints fast without leaking state.
            </p>

            <dl className="grid grid-cols-3 gap-3 pt-2">
              {stats.map((s) => (
                <div key={s.k} className="rounded-lg border border-border bg-card/50 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</dt>
                  <dd className="mt-1 font-mono text-2xl text-primary">{s.v}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setRun((r) => r + 1)}
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/15"
            >
              {run === 0 ? <Play className="size-4" /> : <RotateCcw className="size-4" />}
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
                        <span className="text-muted-foreground">{">"}</span> {l.out}
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
  );
}
