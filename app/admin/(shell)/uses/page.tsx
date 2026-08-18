import Link from "next/link"
import { FolderPlus, Pencil } from "lucide-react"
import { UsesDeleteDialog } from "@/components/admin/uses-delete-dialog"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminUsesPage() {
  await requireAdmin()
  const usesGroups = await db.usesGroup.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// content · uses"}
          </p>
          <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            setup registry
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Organize the hardware, software, and systems displayed in the public
            setup section.
          </p>
        </div>
        <Link
          href="/admin/uses/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          <FolderPlus className="size-4" /> $ new group
        </Link>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> ls -la ~/uses
          </p>
          <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {usesGroups.length} {usesGroups.length === 1 ? "group" : "groups"}
          </span>
        </div>

        {usesGroups.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">$</span> ls -la ~/uses
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              total 0 · no setup groups found
            </p>
            <Link
              href="/admin/uses/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <FolderPlus className="size-3.5" /> create the first group
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-border bg-muted/15">
                <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    group
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    command
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    items
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    order
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usesGroups.map((usesGroup) => (
                  <tr
                    key={usesGroup.id}
                    className="transition-colors hover:bg-primary/[0.035]"
                  >
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/admin/uses/${usesGroup.id}/edit`}
                        className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                      >
                        <span className="text-muted-foreground">./</span>
                        {usesGroup.group}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="rounded border border-primary/25 bg-primary/5 px-2 py-1 font-mono text-xs text-primary">
                        $ {usesGroup.cmd}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex max-w-72 flex-wrap gap-1">
                        {usesGroup.items.map((item) => (
                          <span
                            key={item}
                            className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right align-top font-mono text-sm text-muted-foreground">
                      {String(usesGroup.order).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/uses/${usesGroup.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          <Pencil className="size-3.5" /> edit
                        </Link>
                        <UsesDeleteDialog
                          usesGroupId={usesGroup.id}
                          groupName={usesGroup.group}
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
