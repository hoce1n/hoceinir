import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjectForm } from "@/components/admin/project-form"
import { requireAdmin } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  await requireAdmin()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> cd ~/projects
      </Link>

      <header className="mt-5 border-b border-border pb-6">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {"// projects · create"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          new project
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a project to the registry. Leave it unpublished to keep it as a
          draft.
        </p>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> nano ~/projects/new
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <ProjectForm mode="create" />
        </div>
      </section>
    </div>
  )
}
