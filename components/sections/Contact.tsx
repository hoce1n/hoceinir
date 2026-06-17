'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Loader2, Send as TgIcon, } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { socials } from "@/lib/content";
import { MagneticCard } from "@/components/fx/MagneticCard";
import { Prompt } from "@/components/terminal/Prompt";
import { cn } from "@/lib/utils";

function Github() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  </svg>
  )
}

function Twitter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4l11.733 16h4.267l-11.733 -16l-4.267 0" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>  
  )
}

function Instagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M16.5 7.5v.01" />
    </svg>  
  )
}

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  X: Twitter,
  Telegram: TgIcon,
  Instagram: Instagram,
};

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema as any) });

  const onSubmit = async (data: ContactInput) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("Message transmitted ✓", {
      description: `connection closed cleanly — thanks, ${data.name.split(" ")[0]}.`,
    });
    reset();
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">// 05 · contact</p>
          <h2 id="contact-heading" className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            open a socket
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Got an idea, a server on fire, or just want to nerd out? Drop a message.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="mb-2"><Prompt>nano message.txt</Prompt></div>

            <Field label="name" error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="ada lovelace"
                className={inputCls(!!errors.name)}
              />
            </Field>

            <Field label="email" error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                placeholder="ada@compute.dev"
                className={inputCls(!!errors.email)}
              />
            </Field>

            <Field label="message" error={errors.message?.message}>
              <textarea
                {...register("message")}
                rows={5}
                placeholder="$ echo 'hey hocein, ...'"
                className={cn(inputCls(!!errors.message), "resize-y")}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {submitting ? "transmitting..." : "send message"}
            </button>
          </form>

          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              // or reach out on
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {socials.map((s) => {
                const Icon = iconFor[s.name];
                return (
                  <li key={s.name}>
                    <MagneticCard strength={10}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-primary">
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-mono text-sm text-foreground">{s.name}</div>
                            <div className="truncate font-mono text-xs text-muted-foreground">{s.handle}</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">→</span>
                      </a>
                    </MagneticCard>
                  </li>
                );
              })}
            </ul>
            <div className="rounded-xl border border-dashed border-border p-4 font-mono text-xs text-muted-foreground">
              <span className="text-primary">tip</span> · I usually reply within 24h. If urgent, ping
              on Telegram.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function inputCls(invalid: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40",
    invalid ? "border-destructive" : "border-border focus:border-primary/60",
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-xs text-muted-foreground">
        <span className="text-primary">$</span> {label}
      </span>
      {children}
      {error && <span className="block font-mono text-xs text-destructive">! {error}</span>}
    </label>
  );
}
