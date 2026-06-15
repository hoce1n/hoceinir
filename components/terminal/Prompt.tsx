import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Prompt({ children, className, user = "hocein", host = "dev", path = "~" }: {
  children?: ReactNode;
  className?: string;
  user?: string;
  host?: string;
  path?: string;
}) {
  return (
    <span className={cn("font-mono text-sm", className)}>
      <span className="text-primary">{user}@{host}</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-accent">{path}</span>
      <span className="text-muted-foreground">$ </span>
      <span className="text-terminal-foreground">{children}</span>
    </span>
  );
}
