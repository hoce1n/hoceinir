import Link from "next/link"
import { requireAdmin } from "@/lib/auth/session"
import { logout } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const admin = await requireAdmin()

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-secondary/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
            <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
              admin — hocein@dev
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-sm">
              <span className="text-primary">hocein@admin</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-accent">/admin</span>
              <span className="text-muted-foreground">$ </span>
              <span className="text-foreground">./whoami</span>
            </p>

            <div className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
              <p>
                [ok] session valid ·{" "}
                <span className="text-primary">authenticated</span>
              </p>
              <p>
                user : <span className="text-foreground">{admin.name}</span>
              </p>
              <p>
                email: <span className="text-foreground">{admin.email}</span>
              </p>
              <p>
                role :{" "}
                <span className="text-primary">{admin.role.toLowerCase()}</span>
              </p>
              <p>[done] exit 0</p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {"// admin shell coming soon"}
              </p>
              <div className="flex flex-wrap gap-3">
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-md border border-border px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    $ exit
                  </button>
                </form>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  cd ~/
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
