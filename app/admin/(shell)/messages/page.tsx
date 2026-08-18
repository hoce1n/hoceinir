import Link from "next/link"
import { Eye, FilePlus2, SlidersHorizontal } from "lucide-react"
import { ContactSettingsForm } from "@/components/admin/contact-settings-form"
import { MessageActionButtons } from "@/components/admin/message-action-buttons"
import { MessageDeleteDialog } from "@/components/admin/message-delete-dialog"
import { SocialLinkDeleteDialog } from "@/components/admin/social-link-delete-dialog"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

type AdminMessagesPageProps = {
  searchParams: Promise<{ view?: string; status?: string }>
}

const statusFilters = ["all", "new", "read", "archived"] as const

export default async function AdminMessagesPage({
  searchParams,
}: AdminMessagesPageProps) {
  await requireAdmin()
  const { view, status } = await searchParams
  const settingsView = view === "settings"

  if (settingsView) {
    const [settings, socialLinks] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: "site" } }),
      db.socialLink.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    ])

    if (!settings) {
      throw new Error("SiteSettings missing — run `pnpm prisma db seed`")
    }

    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <MessagesHeader activeView="settings" />
        <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
          <TerminalBar command="nano ~/config/contact.conf" />
          <div className="p-5 sm:p-6">
            <ContactSettingsForm
              settings={{
                tip: settings.tip,
                contactIntro: settings.contactIntro,
              }}
            />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
          <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-destructive/80" />
              <span className="size-2.5 rounded-full bg-secondary/80" />
              <span className="size-2.5 rounded-full bg-primary/80" />
              <p className="ml-2 font-mono text-xs text-muted-foreground">
                <span className="text-primary">$</span> ls -la ~/contact/socials
              </p>
            </div>
            <Link
              href="/admin/messages/socials/new"
              className="ml-auto inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <FilePlus2 className="size-3.5" /> new social
            </Link>
          </div>

          {socialLinks.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-mono text-xs text-muted-foreground">
                total 0 · no public contact endpoints found
              </p>
              <Link
                href="/admin/messages/socials/new"
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/10"
              >
                <FilePlus2 className="size-3.5" /> create the first social
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-border bg-muted/15">
                  <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    <th scope="col" className="px-4 py-3 font-medium">
                      name
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      handle
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      URL
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      order
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {socialLinks.map((socialLink) => (
                    <tr
                      key={socialLink.id}
                      className="transition-colors hover:bg-primary/[0.035]"
                    >
                      <td className="px-4 py-4 font-mono text-sm text-foreground">
                        ./{socialLink.name}
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-muted-foreground">
                        {socialLink.handle}
                      </td>
                      <td className="max-w-64 truncate px-4 py-4 font-mono text-xs text-muted-foreground">
                        {socialLink.href}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-muted-foreground">
                        {String(socialLink.order).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/messages/socials/${socialLink.id}/edit`}
                            className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            edit
                          </Link>
                          <SocialLinkDeleteDialog
                            socialLinkId={socialLink.id}
                            socialName={socialLink.name}
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

  const activeStatus =
    status === "new" || status === "read" || status === "archived"
      ? status
      : "all"
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
  const visibleMessages =
    activeStatus === "all"
      ? messages
      : messages.filter(
          (message) => message.status === activeStatus.toUpperCase()
        )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <MessagesHeader activeView="inbox" />
      <div
        className="mt-6 flex flex-wrap gap-2"
        aria-label="Message status filter"
      >
        {statusFilters.map((filter) => {
          const active = activeStatus === filter
          const href =
            filter === "all"
              ? "/admin/messages"
              : `/admin/messages?status=${filter}`
          return (
            <Link
              key={filter}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
              }`}
            >
              {filter === "all" ? "$ " : "./"}
              {filter}
            </Link>
          )
        })}
      </div>

      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <TerminalBar
          command="tail -f /var/log/messages"
          count={visibleMessages.length}
        />

        {visibleMessages.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">$</span> tail -f /var/log/messages
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              no {activeStatus === "all" ? "contact messages" : activeStatus}{" "}
              messages found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left">
              <thead className="border-b border-border bg-muted/15">
                <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    sender
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    message
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    received
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="transition-colors hover:bg-primary/[0.035]"
                  >
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/admin/messages/${message.id}`}
                        className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                      >
                        ./{message.name}
                      </Link>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {message.email}
                      </p>
                    </td>
                    <td className="max-w-md px-4 py-4 align-top text-sm text-muted-foreground">
                      <p className="truncate">
                        {message.message.replace(/\s+/g, " ")}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <MessageStatusBadge status={message.status} />
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-xs text-muted-foreground">
                      {message.createdAt
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/messages/${message.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          <Eye className="size-3.5" /> view
                        </Link>
                        <MessageActionButtons
                          messageId={message.id}
                          status={message.status}
                          compact
                        />
                        <MessageDeleteDialog
                          messageId={message.id}
                          senderName={message.name}
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

function MessagesHeader({ activeView }: { activeView: "inbox" | "settings" }) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {"// contact · messages"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {activeView === "inbox" ? "inbox monitor" : "contact settings"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {activeView === "inbox"
            ? "Inspect contact transmissions, follow up, archive completed requests, and keep the queue clear."
            : "Manage the public contact copy and the social endpoints shown next to the contact form."}
        </p>
      </div>
      <Link
        href={
          activeView === "inbox"
            ? "/admin/messages?view=settings"
            : "/admin/messages"
        }
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <SlidersHorizontal className="size-4" />
        {activeView === "inbox" ? "$ contact settings" : "$ inbox"}
      </Link>
    </header>
  )
}

function TerminalBar({ command, count }: { command: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
      <span className="size-2.5 rounded-full bg-destructive/80" />
      <span className="size-2.5 rounded-full bg-secondary/80" />
      <span className="size-2.5 rounded-full bg-primary/80" />
      <p className="ml-2 font-mono text-xs text-muted-foreground">
        <span className="text-primary">$</span> {command}
      </p>
      {typeof count === "number" ? (
        <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      ) : null}
    </div>
  )
}

function MessageStatusBadge({
  status,
}: {
  status: "NEW" | "READ" | "ARCHIVED"
}) {
  const style = {
    NEW: "bg-primary shadow-[0_0_10px_var(--primary)]",
    READ: "bg-secondary shadow-[0_0_10px_var(--secondary)]",
    ARCHIVED: "bg-muted-foreground/60",
  } as const

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
      <span className={`size-2 rounded-full ${style[status]}`} />
      {status}
    </span>
  )
}
