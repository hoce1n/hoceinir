import Link from "next/link"
import { Terminal } from "lucide-react"
import type { AdminNavItem } from "@/lib/admin-nav"

export function AdminPlaceholder({ item }: { item: AdminNavItem }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-secondary/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
          <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
            admin — hocein@dev /{item.label}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-mono text-sm">
            <span className="text-primary">hocein@admin</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-accent">/admin/{item.label}</span>
            <span className="text-muted-foreground">$ </span>
            <span className="text-foreground">cat README.md</span>
          </p>

          <div className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
            <p>
              [ok] route <span className="text-primary">{item.href}</span> is protected
            </p>
            <p>
              [ok] session valid · <span className="text-primary">authenticated</span>
            </p>
            <p>
              [warn] module not implemented yet — <span className="text-accent">{item.label}</span>
            </p>
            <p>[done] exit 0</p>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {"// management shell coming soon"}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Terminal className="size-4" />
                cd ../
              </Link>
              <span className="font-mono text-xs text-muted-foreground/70">
                use <span className="text-foreground">⌘K</span> to jump between sections
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
