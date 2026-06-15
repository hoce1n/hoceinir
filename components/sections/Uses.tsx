'use client';
import { motion } from "framer-motion";
import { uses } from "@/lib/content";
import { Prompt } from "@/components/terminal/Prompt";

export function Uses() {
  return (
    <section id="uses" aria-labelledby="uses-heading" className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">// 04 · uses</p>
          <h2 id="uses-heading" className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            the setup
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Hardware, OS, and software I actually reach for. No affiliate links, just opinions.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {uses.map((g, i) => (
            <motion.div
              key={g.group}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-mono text-sm font-medium text-primary">## {g.group}</h3>
                <Prompt>{g.cmd}</Prompt>
              </div>
              <ul className="space-y-1.5">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="group flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-sm text-foreground transition-colors hover:bg-muted/60"
                  >
                    <span className="text-primary transition-transform group-hover:translate-x-0.5">▸</span>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
