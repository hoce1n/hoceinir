import Link from "next/link"
import { requireAdmin } from "@/lib/auth/session"
import { getAdminStats, formatUptime } from "@/lib/data/admin"
import { adminNav } from "@/lib/admin-nav"

export const dynamic = "force-dynamic"

const statLabels: Record<string, string> = {
  projects: "./projects",
  logs: "./logs",
  poetry: "./poetry",
  messages: "./messages",
  newMessages: "./messages --new",
  usesGroups: "./uses",
  socials: "./socials",
  users: "./users",
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin()
  const stats = await getAdminStats()

  const statRows: { cmd: string; value: number; hint?: string }[] = [
    { cmd: statLabels.projects, value: stats.projects },
    { cmd: statLabels.logs, value: stats.logs },
    { cmd: statLabels.poetry, value: stats.poetry },
    {
      cmd: statLabels.messages,
      value: stats.messages,
      hint: stats.newMessages > 0 ? `${stats.newMessages} new` : undefined,
    },
    { cmd: statLabels.usesGroups, value: stats.usesGroups },
    { cmd: statLabels.socials, value: stats.socials },
    { cmd: statLabels.users, value: stats.users },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p className="font-mono text-sm">
        <span className="text-primary">hocein@admin</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-accent">/admin</span>
        <span className="text-muted-foreground">$ </span>
        <span className="text-foreground">./status</span>
      </p>

      <div className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
        <p>
          [ok] session valid · <span className="text-primary">authenticated</span>
        </p>
        <p>
          user : <span className="text-foreground">{admin.name}</span>
        </p>
        <p>
          email: <span className="text-foreground">{admin.email}</span>
        </p>
        <p>
          role : <span className="text-primary">{admin.role.toLowerCase()}</span>
        </p>
        <p>[done] exit 0</p>
      </div>

      <div className="mt-8">
        <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {"// content inventory"}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {statRows.map((row) => (
            <div
              key={row.cmd}
              className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm shadow-black/20"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-mono text-xs text-muted-foreground">
                  $ ls {row.cmd}
                </span>
                {row.hint && (
                  <span className="shrink-0 rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                    {row.hint}
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-2xl text-foreground">
                {row.value}
                <span className="ml-1 text-sm text-muted-foreground">entries</span>
              </p>
            </div>
          ))}

          <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm shadow-black/20">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate font-mono text-xs text-muted-foreground">
                $ uptime
              </span>
            </div>
            <p className="mt-2 font-mono text-lg text-foreground">
              {formatUptime(stats.uptimeSeconds)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm shadow-black/20">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate font-mono text-xs text-muted-foreground">
                $ loadavg
              </span>
            </div>
            <p className="mt-2 font-mono text-lg text-foreground">
              {stats.loadAvg
                .slice(0, 3)
                .map((n) => n.toFixed(2))
                .join(" · ")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {"// quick access"}
        </p>
        <div className="flex flex-wrap gap-3">
          {adminNav
            .flatMap((g) => g.items)
            .filter((item) => item.href !== "/admin")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <item.icon className="size-4" />
                {item.label}
                <span className="hidden text-xs text-muted-foreground/60 sm:inline">
                  ({item.hint})
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
