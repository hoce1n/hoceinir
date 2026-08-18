import Link from "next/link"
import { Filter, RotateCcw, ShieldCheck } from "lucide-react"
import { RevokeSessionDialog } from "@/components/admin/revoke-session-dialog"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

type AdminLogsPageProps = {
  searchParams: Promise<{ action?: string; entity?: string }>
}

export default async function AdminLogsPage({
  searchParams,
}: AdminLogsPageProps) {
  const admin = await requireAdmin()
  const { action, entity } = await searchParams
  const actionFilter = normalizeFilter(action)
  const entityFilter = normalizeFilter(entity)

  const [logs, sessions] = await Promise.all([
    db.activityLog.findMany({
      where: {
        ...(actionFilter ? { action: actionFilter } : {}),
        ...(entityFilter ? { entity: entityFilter } : {}),
      },
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 150,
    }),
    db.adminSession.findMany({
      where: {
        expiresAt: { gt: new Date() },
        ...(admin.role === "OWNER" ? {} : { userId: admin.id }),
      },
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { lastUsedAt: "desc" },
    }),
  ])

  const sessionScope =
    admin.role === "OWNER"
      ? "all active administrator sessions"
      : "your active sessions"

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// observability · access"}
          </p>
          <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            journal & sessions
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Review administrative activity and active login sessions.{" "}
            <span className="font-mono text-primary">
              {admin.role.toLowerCase()}
            </span>{" "}
            scope grants access to {sessionScope}.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-md border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-xs text-primary lg:self-auto">
          <ShieldCheck className="size-3.5" /> role: {admin.role.toLowerCase()}
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <TerminalBar command="journalctl -f --unit=admin" count={logs.length} />
        <form className="flex flex-wrap items-end gap-3 border-b border-border bg-muted/10 px-4 py-4">
          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              action
            </span>
            <input
              name="action"
              defaultValue={actionFilter}
              placeholder="e.g. UPDATE"
              className="w-44 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              entity
            </span>
            <input
              name="entity"
              defaultValue={entityFilter}
              placeholder="e.g. Project"
              className="w-44 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/10"
          >
            <Filter className="size-3.5" /> filter
          </button>
          {actionFilter || entityFilter ? (
            <Link
              href="/admin/logs"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <RotateCcw className="size-3.5" /> clear
            </Link>
          ) : null}
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            newest first · last 150 entries
          </span>
        </form>

        {logs.length === 0 ? (
          <EmptyState
            command="journalctl -f --unit=admin"
            message="No activity entries match the current filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="border-b border-border bg-muted/15">
                <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    timestamp
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    user
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    action
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    entity
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    detail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-primary/[0.035]"
                  >
                    <td className="px-4 py-3.5 align-top font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <p className="font-mono text-xs text-foreground">
                        {log.user?.name ?? "system"}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {log.user?.email ?? "no associated user"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-4 py-3.5 align-top font-mono text-xs text-muted-foreground">
                      <p className="text-foreground">{log.entity}</p>
                      <p className="mt-1 max-w-40 truncate text-[10px]">
                        {log.entityId ?? "—"}
                      </p>
                    </td>
                    <td className="max-w-md px-4 py-3.5 align-top font-mono text-[10px] leading-relaxed break-words text-muted-foreground">
                      {formatDetail(log.detail)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <TerminalBar
          command={
            admin.role === "OWNER"
              ? "who --sessions --all"
              : "who --sessions --self"
          }
          count={sessions.length}
        />
        <div className="border-b border-border bg-muted/10 px-4 py-3 font-mono text-xs text-muted-foreground">
          {admin.role === "OWNER"
            ? "OWNER scope: all active sessions are visible and revocable."
            : "Account scope: only your active sessions are visible and revocable."}
        </div>
        {sessions.length === 0 ? (
          <EmptyState
            command="who --sessions"
            message="No active sessions were found."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-border bg-muted/15">
                <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    admin
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    origin
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    last used
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    expires
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="transition-colors hover:bg-primary/[0.035]"
                  >
                    <td className="px-4 py-3.5 align-top">
                      <p className="font-mono text-xs text-foreground">
                        {session.user.name}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {session.user.email} · {session.user.role.toLowerCase()}
                      </p>
                    </td>
                    <td className="max-w-xs px-4 py-3.5 align-top">
                      <p className="font-mono text-xs text-muted-foreground">
                        {session.ip ?? "unknown ip"}
                      </p>
                      <p
                        className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70"
                        title={session.userAgent ?? undefined}
                      >
                        {session.userAgent ?? "unknown user agent"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 align-top font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {formatDate(session.lastUsedAt)}
                    </td>
                    <td className="px-4 py-3.5 align-top font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {formatDate(session.expiresAt)}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex justify-end">
                        <RevokeSessionDialog
                          sessionId={session.id}
                          sessionUser={session.user.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function TerminalBar({ command, count }: { command: string; count: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
      <span className="size-2.5 rounded-full bg-destructive/80" />
      <span className="size-2.5 rounded-full bg-secondary/80" />
      <span className="size-2.5 rounded-full bg-primary/80" />
      <p className="ml-2 font-mono text-xs text-muted-foreground">
        <span className="text-primary">$</span> {command}
      </p>
      <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {count} {count === 1 ? "entry" : "entries"}
      </span>
    </div>
  )
}

function EmptyState({
  command,
  message,
}: {
  command: string
  message: string
}) {
  return (
    <div className="px-5 py-14 text-center">
      <p className="font-mono text-sm text-muted-foreground">
        <span className="text-primary">$</span> {command}
      </p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{message}</p>
    </div>
  )
}

function ActionBadge({ action }: { action: string }) {
  const tone =
    action === "DELETE" || action === "REVOKE_SESSION"
      ? "border-destructive/40 text-destructive"
      : action === "CREATE"
        ? "border-primary/40 text-primary"
        : "border-secondary/40 text-secondary"
  return (
    <span
      className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-widest ${tone}`}
    >
      {action}
    </span>
  )
}

function formatDetail(detail: unknown): string {
  if (!detail) return "—"
  try {
    return JSON.stringify(detail)
  } catch {
    return "[unserializable detail]"
  }
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 16).replace("T", " ")
}

function normalizeFilter(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized && normalized.length <= 80 ? normalized : undefined
}
