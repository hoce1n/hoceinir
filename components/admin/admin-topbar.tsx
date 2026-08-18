import type { Admin } from "@/lib/auth/session"
import { logout } from "@/app/admin/actions"
import { CommandPalette } from "@/components/admin/command-palette"

export function AdminTopbar({ admin }: { admin: Admin }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/40 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="truncate font-mono text-xs text-muted-foreground">
          {admin.name}{" "}
          <span className="text-foreground/70">@ {admin.email}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <CommandPalette />
        <span className="inline-flex rounded border border-primary/30 bg-primary/5 px-2 py-1 font-mono text-[10px] tracking-widest text-primary uppercase">
          {admin.role}
        </span>
        <form action={logout}>
          <button
            type="submit"
            title="Sign out of the admin panel"
            className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
          >
            $ exit
          </button>
        </form>
      </div>
    </header>
  )
}
