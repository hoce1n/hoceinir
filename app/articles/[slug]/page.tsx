import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, Home } from "lucide-react"
import { getArticleBySlug } from "@/lib/data/articles"
import { getSiteSettings, getSocials } from "@/lib/data/content"
import { Markdown } from "@/components/articles/Markdown"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  return {
    title: article
      ? `${article.title} · ~/hocein`
      : "article not found · ~/hocein",
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [article, site, socials] = await Promise.all([
    getArticleBySlug(slug),
    getSiteSettings(),
    getSocials(),
  ])

  if (!article) notFound()

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SiteHeader
        brandLeft={site.headerBrandLeft}
        brandRight={site.headerBrandRight}
        nav={site.nav}
      />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <Home className="size-3" /> cd ~/articles
        </Link>

        <header className="mt-6 mb-8 space-y-4">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// "}
            {article.kind === "log" ? "dev log" : "poetry"}
          </p>
          <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            {article.date ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" /> {article.date}
              </span>
            ) : null}
            {article.readTime ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3" /> {article.readTime}
              </span>
            ) : null}
            {article.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    #{t}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
          <Markdown content={article.content} />
          {article.closer ? (
            <p className="mt-6 border-t border-border pt-4 font-mono text-sm text-destructive">
              {article.closer}
            </p>
          ) : null}
        </div>

        <div className="mt-10 flex justify-between gap-4 font-mono text-xs">
          <Link
            href="/articles"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            ← back to articles
          </Link>
          <a
            href="#top"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            top ^
          </a>
        </div>
      </main>
      <SiteFooter
        socials={socials}
        footerLeft={site.footerLeft}
        footerStatus={site.footerStatus}
        footerRight={site.footerRight}
      />
    </div>
  )
}
