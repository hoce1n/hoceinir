import { cn } from "@/lib/utils";

const map = {
  live: "bg-primary shadow-[0_0_10px_var(--primary)]",
  wip: "bg-secondary shadow-[0_0_10px_var(--secondary)]",
  archived: "bg-muted-foreground/60",
} as const;

export function StatusDot({ status, label }: { status: keyof typeof map; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <span className="relative inline-flex">
        <span className={cn("h-2 w-2 rounded-full", map[status])} />
        {status !== "archived" && (
          <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", map[status])} />
        )}
      </span>
      {label ?? status}
    </span>
  );
}
