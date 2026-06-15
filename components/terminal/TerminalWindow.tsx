import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export function TerminalWindow({ title = "zsh — hocein@dev", className, bodyClassName, children }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-terminal shadow-2xl shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-secondary/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
        <span className="ml-3 truncate font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      <div className={cn("p-4 font-mono text-sm text-terminal-foreground sm:p-5", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
