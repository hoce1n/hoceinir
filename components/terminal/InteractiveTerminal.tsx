'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const banner: Line[] = [
  { kind: "out", text: "hocein-shell v2.0 · type 'help' to list commands" },
];

const helpText: Line[] = [
  { kind: "out", text: "┌─────────────┬─────────────────────────────┐" },
  { kind: "out", text: "│ command     │ description                 │" },
  { kind: "out", text: "├─────────────┼─────────────────────────────┤" },
  { kind: "out", text: "│ about       │ Execute bio stream          │" },
  { kind: "out", text: "│ stack       │ Print modern stack binaries │" },
  { kind: "out", text: "│ auth-status │ Check active session details│" },
  { kind: "out", text: "│ clear       │ Flush terminal history      │" },
  { kind: "out", text: "└─────────────┴─────────────────────────────┘" },
];

const stackText: Line[] = [
  { kind: "ok", text: "runtime environment:" },
  { kind: "ok", text: "├── Frontend  :: Next.js (App Router) · TypeScript · Tailwind CSS" },
  { kind: "ok", text: "├── Backend   :: Go (Golang) · REST Node API Routes · Microservices" },
  { kind: "ok", text: "├── Database  :: Prisma ORM · PostgreSQL · MySQL · SQLite" },
  { kind: "ok", text: "└── Security  :: Better-Auth · HTTP-Only Cookies · Session Caching" },
];

const authStatusText: Line[] = [
  { kind: "ok", text: "[SUCCESS] Active session decrypted via server cookies." },
  { kind: "out", text: "Tenant    :: hocein@root-domain" },
  { kind: "out", text: "Strategy  :: Better-Auth Layer (Session-token)" },
  { kind: "out", text: "Cache     :: HIT (Edge KV Storage)" },
  { kind: "out", text: "Status    :: Connected to PostgreSQL cluster" },
];

const aboutText: Line[] = [
  { kind: "out", text: "[ok] loading developer profile..." },
  { kind: "out", text: "name        : hocein" },
  { kind: "out", text: "role        : Full-Stack Dev / Linux SysAdmin" },
  { kind: "out", text: "loves       : Next.js, Prisma, Go, clean shell scripts" },
  { kind: "out", text: "currently   : building API gateways & auth middleware" },
  { kind: "out", text: "philosophy  : ship neat, configure deeply, document later" },
  { kind: "out", text: "[done] exit 0" },
];

export function InteractiveTerminal() {
  const [lines, setLines] = useState<Line[]>(banner);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push({ kind: "in", text: raw });
    if (!cmd) return;
    setHistory((h) => [raw, ...h].slice(0, 25));
    setHIdx(-1);

    switch (cmd) {
      case "help":
        push(...helpText);
        break;
      case "stack":
        push(...stackText);
        break;
      case "auth-status":
        push(...authStatusText);
        break;
      case "about":
        push(...aboutText);
        break;
      case "sudo":
      case "sudo su":
      case "sudo -i":
      case "chmod 777":
        push({
          kind: "err",
          text: "Operation not permitted. Master binary encrypted. Active sessions are strictly monitored via HTTP-Only cookies.",
        });
        break;
      case "clear":
      case "cls":
        setLines([]);
        break;
      case "whoami":
        push({ kind: "out", text: "guest (curious visitor)" });
        break;
      default:
        push({
          kind: "err",
          text: `command not found: ${raw} — try 'help'`,
        });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = Math.min(hIdx + 1, history.length - 1);
        setHIdx(next);
        setValue(history[next] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(hIdx - 1, -1);
      setHIdx(next);
      setValue(next === -1 ? "" : history[next] ?? "");
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="overflow-hidden rounded-lg border border-border bg-terminal shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-secondary/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
        <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
          hocein@portfolio · interactive shell
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-64 min-h-[180px] overflow-y-auto p-4 font-mono text-sm leading-relaxed"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.kind === "in"
                ? "text-foreground"
                : l.kind === "err"
                  ? "text-destructive"
                  : l.kind === "ok"
                    ? "text-primary"
                    : "text-muted-foreground"
            }
          >
            {l.kind === "in" ? (
              <>
                <span className="text-primary">hocein@portfolio</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-accent">~</span>
                <span className="text-muted-foreground">$ </span>
                <span>{l.text}</span>
              </>
            ) : (
              <span className="whitespace-pre">{l.text}</span>
            )}
          </div>
        ))}

        <div className="mt-1 flex items-center">
          <span className="font-mono text-sm">
            <span className="text-primary">hocein@portfolio</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-accent">~</span>
            <span className="text-muted-foreground">$ </span>
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            aria-label="Interactive terminal input"
            className="ml-1 flex-1 border-0 bg-transparent p-0 font-mono text-sm text-foreground caret-primary outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}
