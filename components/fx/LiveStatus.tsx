'use client';

import { useEffect, useState } from "react";
import { Cpu, MemoryStick, Activity } from "lucide-react";

type Row = {
  label: string;
  task: string;
  icon: React.ComponentType<{ className?: string }>;
  base: number;
  jitter: number;
};

const rows: Row[] = [
  { label: "CPU", task: "Optimizing Next.js Hydration", icon: Cpu, base: 42, jitter: 18 },
  { label: "RAM", task: "Caching StudyHall Seating Maps", icon: MemoryStick, base: 61, jitter: 12 },
  { label: "NET", task: "Rotating Better-Auth session cookies", icon: Activity, base: 24, jitter: 22 },
];

function useTick(ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}

export function LiveStatus() {
  const tick = useTick();
  const values = rows.map((r) => {
    const seed = Math.sin(tick * 1.7 + r.base) * 0.5 + 0.5;
    return Math.max(6, Math.min(98, Math.round(r.base + (seed - 0.5) * 2 * r.jitter)));
  });

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span>htop · hocein.brain</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">live</span>
      </div>

      <ul className="space-y-3">
        {rows.map((r, i) => {
          const v = values[i];
          const Icon = r.icon;
          const hot = v > 80;
          return (
            <li key={r.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 font-mono text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className="size-3.5 text-primary" />
                  <span className="text-foreground">{r.label}</span>
                  <span className="truncate text-muted-foreground">· {r.task}</span>
                </div>
                <span
                  className={
                    hot ? "tabular-nums text-destructive" : "tabular-nums text-primary"
                  }
                >
                  {v.toString().padStart(2, "0")}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className={
                    "h-full rounded-full transition-[width] duration-700 ease-out " +
                    (hot ? "bg-destructive" : "bg-primary")
                  }
                  style={{ width: `${v}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 font-mono text-[10px] text-muted-foreground">
        <div>load: <span className="text-foreground">0.42 0.31 0.27</span></div>
        <div>tasks: <span className="text-foreground">128</span></div>
        <div>uptime: <span className="text-primary">∞</span></div>
      </div>
    </div>
  );
}
