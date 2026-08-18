import Link from "next/link"
import { ExternalLink, FilePlus2, Pencil } from "lucide-react"
import { ArticleDeleteDialog } from "@/components/admin/article-delete-dialog"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

type AdminArticlesPageProps = {
  searchParams: Promise<{ kind?: string }>
}

const filters = [
  { value: "all", label: "all entries" },
  { value: "log", label: "dev logs" },
  { value: "poetry", label: "tech poetry" },
] as const

export default async function AdminArticlesPage({
  searchParams,
}: AdminArticlesPageProps) {
  await requireAdmin()
  const { kind } = await searchParams
  const activeFilter = kind === "log" || kind === "poetry" ? kind : "all"
  const articles = await db.article.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  })
  const visibleArticles =
    activeFilter === "all"
      ? articles
      : articles.filter(
          (article) => article.kind === activeFilter.toUpperCase()
        )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// content · articles"}
          </p>
          <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            writing registry
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage public dev logs and the terminal-confessions in the tech
            poetry scroll.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          <FilePlus2 className="size-4" /> $ new article
        </Link>
      </header>

      <div
        className="mt-6 flex flex-wrap gap-2"
        aria-label="Article kind filter"
      >
        {filters.map((filter) => {
          const active = activeFilter === filter.value
          const href =
            filter.value === "all"
              ? "/admin/articles"
              : `/admin/articles?kind=${filter.value}`

          return (
            <Link
              key={filter.value}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
              }`}
            >
              {filter.value === "all" ? "$ " : "./"}
              {filter.label}
            </Link>
          )
        })}
      </div>

      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> ls -la ~/articles/
            {activeFilter}
          </p>
          <span className="ml-auto font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {visibleArticles.length}{" "}
            {visibleArticles.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {visibleArticles.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-primary">$</span> ls -la ~/articles/
              {activeFilter}
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              total 0 · no matching entries found
            </p>
            <Link
              href="/admin/articles/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <FilePlus2 className="size-3.5" /> create the first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead className="border-b border-border bg-muted/15">
                <tr className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    title
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    kind
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    tags
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    date
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
                {visibleArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="transition-colors hover:bg-primary/[0.035]"
                  >
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                      >
                        <span className="text-muted-foreground">./</span>
                        {article.title}
                      </Link>
                      <p className="mt-1 max-w-sm truncate font-mono text-[11px] text-muted-foreground">
                        {article.slug}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase ${
                          article.kind === "LOG"
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-secondary/40 bg-secondary/10 text-secondary"
                        }`}
                      >
                        {article.kind}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        <span
                          className={`size-2 rounded-full ${
                            article.published
                              ? "bg-primary shadow-[0_0_10px_var(--primary)]"
                              : "bg-muted-foreground/60"
                          }`}
                        />
                        {article.published ? "published" : "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex max-w-48 flex-wrap gap-1">
                        {article.tags.length ? (
                          article.tags.map((tag) => (
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
                    <td className="px-4 py-4 align-top font-mono text-xs text-muted-foreground">
                      {article.publishedAt
                        ? article.publishedAt.toISOString().slice(0, 10)
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-right align-top font-mono text-sm text-muted-foreground">
                      {String(article.order).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          <Pencil className="size-3.5" /> edit
                        </Link>
                        {article.published ? (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            <ExternalLink className="size-3.5" /> view
                          </Link>
                        ) : null}
                        <ArticleDeleteDialog
                          articleId={article.id}
                          articleTitle={article.title}
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
