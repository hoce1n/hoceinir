'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#about", label: "about" },
  { href: "#articles", label: "articles" },
  { href: "#projects", label: "projects" },
  { href: "#uses", label: "uses" },
  { href: "#contact", label: "contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#hero" className="flex min-w-0 items-center gap-2 font-mono text-sm">
          <span className="text-primary">~/hocein</span>
          <span className="text-muted-foreground">$</span>
          <span className="truncate text-foreground">portfolio.exe</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              cd {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="md:hidden rounded-md border border-border px-3 py-1.5 font-mono text-xs text-foreground"
        >
          contact
        </a>
      </div>
    </header>
  );
}
