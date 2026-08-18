import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { Prompt } from "@/components/terminal/Prompt"
import { TerminalWindow } from "@/components/terminal/TerminalWindow"
import { getAllPublishedArticles } from "@/lib/data/articles"
import { getSiteSettings, getSocials } from "@/lib/data/content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "articles · ~/hocein",
  description: "Published dev logs and tech poetry from hocein.",
}

export default async function ArticlesIndexPage() {
  const [articles, site, socials] = await Promise.all([
    getAllPublishedArticles(),
    getSiteSettings(),
    getSocials(),
  ])

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SiteHeader
        brandLeft={site.headerBrandLeft}
        brandRight={site.headerBrandRight}
        nav={site.nav}
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3" /> cd ~/
        </Link>

        <header className="mt-6 border-b border-border pb-8">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// article archive"}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
                ~/articles
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Published dev logs and terminal-confessions, ordered from the
                latest release backwards.
              </p>
            </div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {articles.length} published
            </p>
          </div>
        </header>

        {articles.length === 0 ? (
          <TerminalWindow title="articles/empty.log" className="mt-10">
            <Prompt>ls -la ~/articles</Prompt>
            <div className="mt-4 border-l-2 border-primary/60 pl-4 font-mono text-sm text-muted-foreground">
              no published articles found. check back after the next deploy.
            </div>
          </TerminalWindow>
        ) : (
          <section
            aria-labelledby="published-articles-heading"
            className="mt-10"
          >
            <h2 id="published-articles-heading" className="sr-only">
              Published articles
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card/70 transition-colors hover:border-primary/60"
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="block p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      <span className="inline-flex items-center gap-1.5 text-primary">
                        <FileText className="size-3" />
                        {article.kind === "log" ? "dev log" : "tech poetry"}
                      </span>
                      <span>cat {article.slug}.md</span>
                    </div>

                    <h2 className="mt-4 font-mono text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {article.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {article.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
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
                    </div>

                    {article.tags.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {article.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            #{tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
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
