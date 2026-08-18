import Link from "next/link"
import { FolderPlus, Pencil } from "lucide-react"
import { ProjectDeleteDialog } from "@/components/admin/project-delete-dialog"
import { ProjectPublishToggle } from "@/components/admin/project-publish-toggle"
import { StatusDot } from "@/components/fx/StatusDot"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  await requireAdmin()
  const projects = await db.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// content · projects"}
          </p>
          <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            project registry
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review, publish, and maintain the projects displayed on the public
            site.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          <FolderPlus className="size-4" /> $ new project
        </Link>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> ls -la ~/projects
          </p>
          <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {projects.length} {projects.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">$</span> ls -la ~/projects
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              total 0 · no projects found
            </p>
            <Link
              href="/admin/projects/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <FolderPlus className="size-3.5" /> create the first project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="border-b border-border bg-muted/15">
                <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    name
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    tags
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    published
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
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-primary/[0.035]"
                  >
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                      >
                        <span className="text-muted-foreground">./</span>
                        {project.title}
                      </Link>
                      <p className="mt-1 max-w-sm truncate text-xs text-muted-foreground">
                        {project.blurb}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusDot
                        status={
                          project.status.toLowerCase() as
                            | "live"
                            | "wip"
                            | "archived"
                        }
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex max-w-56 flex-wrap gap-1">
                        {project.tags.length ? (
                          project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground/70">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <ProjectPublishToggle
                        project={{
                          id: project.id,
                          title: project.title,
                          blurb: project.blurb,
                          tags: project.tags,
                          status: project.status,
                          repo: project.repo,
                          url: project.url,
                          order: project.order,
                          published: project.published,
                        }}
                      />
                    </td>
                    <td className="px-4 py-4 text-right align-top font-mono text-sm text-muted-foreground">
                      {String(project.order).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          <Pencil className="size-3.5" /> edit
                        </Link>
                        <ProjectDeleteDialog
                          projectId={project.id}
                          projectTitle={project.title}
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
