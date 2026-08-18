import { db } from "@/lib/db"
import { ArticleKind } from "@/lib/generated/prisma/enums"

export type ArticleCard = {
  slug: string
  title: string
  kind: "poetry" | "log"
  excerpt: string
  closer: string | null
  date: string | null
  readTime: string | null
  tags: string[]
}

export type ArticleDetail = {
  slug: string
  title: string
  kind: "poetry" | "log"
  excerpt: string | null
  content: string
  closer: string | null
  date: string | null
  readTime: string | null
  tags: string[]
}

function formatDate(publishedAt: Date | null): string | null {
  return publishedAt ? publishedAt.toISOString().slice(0, 10) : null
}

export async function getArticles(): Promise<ArticleCard[]> {
  const rows = await db.article.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  })

  const sorted = [...rows].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === ArticleKind.POETRY ? -1 : 1
    return a.order - b.order
  })

  return sorted.map((r) => ({
    slug: r.slug,
    title: r.title,
    kind: r.kind === ArticleKind.POETRY ? "poetry" : "log",
    excerpt:
      r.kind === ArticleKind.POETRY ? r.content : (r.excerpt ?? r.content),
    closer: r.closer,
    date: formatDate(r.publishedAt),
    readTime: r.readTime,
    tags: r.tags,
  }))
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetail | null> {
  const row = await db.article.findFirst({
    where: { slug, published: true },
  })
  if (!row) return null

  return {
    slug: row.slug,
    title: row.title,
    kind: row.kind === ArticleKind.POETRY ? "poetry" : "log",
    excerpt: row.excerpt,
    content: row.content,
    closer: row.closer,
    date: formatDate(row.publishedAt),
    readTime: row.readTime,
    tags: row.tags,
  }
}
