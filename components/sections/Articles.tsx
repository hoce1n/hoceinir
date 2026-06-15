'use client';
import { motion } from "framer-motion";
import { articles } from "@/lib/content";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { FallingText } from "@/components/terminal/FallingText";
import { Prompt } from "@/components/terminal/Prompt";
import ScrollStack, { ScrollStackItem } from "@/components/terminal/ScrollStack";
import { Calendar, Clock } from "lucide-react";

export function Articles() {
  const poetry = articles.filter((a) => a.kind === "poetry");
  const logs = articles.filter((a) => a.kind === "log");

  return (
    <section id="articles" aria-labelledby="articles-heading" className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">// 02 · articles</p>
          <h2 id="articles-heading" className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            tech poetry &amp; dev logs
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Half terminal-confessions, half field notes from production.
          </p>
        </header>

        <ScrollStack
          useWindowScroll={false}
          itemDistance={80}
          itemScale={0.04}
          itemStackDistance={24}
          baseScale={0.88}
          blurAmount={1.2}
          className="rounded-md border border-border bg-background/40"
        >
          {poetry.map((p, i) => (
            <ScrollStackItem key={i} itemClassName="p-0 overflow-hidden">
              <TerminalWindow title={`poetry/${p.title}.log`} className="h-full border-0">
                <div className="space-y-3">
                  <Prompt>cat {p.title}.log</Prompt>
                  <p className="whitespace-pre-wrap pl-4 leading-relaxed text-terminal-foreground">
                    <FallingText text={p.body} stagger={0.006} />
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="pl-4 font-mono text-sm text-destructive"
                  >
                    {p.closer}
                  </motion.p>
                  <Prompt>
                    <span className="caret-blink inline-block h-[1em] w-[0.55ch] -translate-y-[2px] bg-primary align-middle" />
                  </Prompt>
                </div>
              </TerminalWindow>
            </ScrollStackItem>
          ))}
        </ScrollStack>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {logs.map((l, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/60"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Calendar className="size-3" />{l.date}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="size-3" />{l.readTime}</span>
              </div>
              <h3 className="mt-3 font-mono text-base font-medium text-foreground group-hover:text-primary">
                {l.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.body}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {l.tags?.map((t) => (
                  <li key={t} className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    #{t}
                  </li>
                ))}
              </ul>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
