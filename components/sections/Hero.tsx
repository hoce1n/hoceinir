'use client';

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypingText } from "@/components/terminal/TypingText";
import { FallingText } from "@/components/terminal/FallingText";
import { Prompt } from "@/components/terminal/Prompt";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="terminal-grid relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pt-28 lg:pb-32">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur"
          >
            <Terminal className="size-3.5 text-primary" />
            <span>v1.0.0 · <span className="text-primary">online</span></span>
          </motion.div>

          <h1 id="hero-heading" className="font-mono text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {/* <FallingText text="Learning by building." /> */}
            <TypingText 
              text="Learning by building." 
              speed={32} 
              startDelay={900} 
              className="text-primary"
            />
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hi, I'm <span className="font-mono text-foreground">hocein</span> — a Full-Stack Developer who enjoys building modern applications with Next.js, React, TypeScript, PostgreSQL, and Prisma.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              ./view_projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              cat about.md
            </a>
          </div>
        </div>

        <div>
          <TerminalWindow title="whoami.sh" className="w-full">
            <div className="space-y-1.5">
              <Prompt>whoami</Prompt>
              <div className="pl-4 text-foreground">hocein</div>
              <Prompt>echo $STACK</Prompt>
              <div className="pl-4 text-primary">next · ts · tailwind · go · prisma · postgres · better-auth</div>
              <Prompt>
                <span className="caret-blink inline-block h-[1em] w-[0.55ch] -translate-y-[2px] bg-primary align-middle" />
              </Prompt>
            </div>
          </TerminalWindow>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          // try it · <span className="text-primary">type 'help'</span>
        </p>
        <InteractiveTerminal />
      </div>
    </section>
  );
}
