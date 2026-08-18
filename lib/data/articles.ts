import { db } from "@/lib/db"
import { ArticleKind } from "@/lib/generated/prisma/enums"

type ArticleRow = Awaited<ReturnType<typeof db.article.findFirst>>

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

function toArticleCard(row: NonNullable<ArticleRow>): ArticleCard {
  return {
    slug: row.slug,
    title: row.title,
    kind: row.kind === ArticleKind.POETRY ? "poetry" : "log",
    excerpt:
      row.kind === ArticleKind.POETRY
        ? row.content
        : (row.excerpt ?? row.content),
    closer: row.closer,
    date: formatDate(row.publishedAt),
    readTime: row.readTime,
    tags: row.tags,
  }
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

  return sorted.map(toArticleCard)
}

export async function getLatestLogArticles(limit = 3): Promise<ArticleCard[]> {
  const rows = await db.article.findMany({
    where: {
      published: true,
      kind: ArticleKind.LOG,
    },
    orderBy: [{ publishedAt: "desc" }, { order: "asc" }],
    take: Math.max(1, Math.floor(limit)),
  })

  return rows.map(toArticleCard)
}

export async function getAllPublishedArticles(): Promise<ArticleCard[]> {
  const rows = await db.article.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { order: "asc" }],
  })

  return rows.map(toArticleCard)
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
