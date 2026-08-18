"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/lib/generated/prisma/client"
import { logActivity } from "@/lib/auth/activity"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import {
  articleIdSchema,
  createArticleSchema,
  updateArticleSchema,
} from "@/lib/validators/article"

export type ArticleActionResult =
  | { success: true; articleId: string; message: string }
  | { success: false; error: string }

type ArticleFields = {
  title: string
  slug: string
  excerpt: string
  content: string
  kind: "LOG" | "POETRY"
  tags: string[]
  readTime: string
  closer: string
  published: boolean
  publishedAt: string
  order: number
}

function articleData(input: ArticleFields) {
  return {
    ...input,
    excerpt: input.excerpt || null,
    readTime: input.readTime || null,
    closer: input.closer || null,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
  }
}

function revalidateArticlePaths(slug: string, previousSlug?: string): void {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/articles")
  revalidatePath(`/articles/${slug}`)

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/articles/${previousSlug}`)
  }
}

function isKnownPrismaError(
  error: unknown,
  code: "P2002" | "P2025"
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
  )
}

export async function createArticle(
  input: unknown
): Promise<ArticleActionResult> {
  const admin = await requireAdmin()
  const parsed = createArticleSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the article fields and try again.",
    }
  }

  try {
    const article = await db.article.create({ data: articleData(parsed.data) })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "CREATE",
      entity: "Article",
      entityId: article.id,
      detail: {
        title: article.title,
        slug: article.slug,
        kind: article.kind,
        published: article.published,
      },
      ip: meta.ip,
    })

    revalidateArticlePaths(article.slug)

    return {
      success: true,
      articleId: article.id,
      message: `Created ${article.title}.`,
    }
  } catch (error) {
    if (isKnownPrismaError(error, "P2002")) {
      return {
        success: false,
        error: "That slug is already in use. Choose a different slug.",
      }
    }

    throw error
  }
}

export async function updateArticle(
  articleId: string,
  input: unknown
): Promise<ArticleActionResult> {
  const admin = await requireAdmin()
  const parsedId = articleIdSchema.safeParse(articleId)
  const parsed = updateArticleSchema.safeParse(input)

  if (!parsedId.success) {
    return { success: false, error: "This article id is invalid." }
  }

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the article fields and try again.",
    }
  }

  const previous = await db.article.findUnique({ where: { id: parsedId.data } })
  if (!previous) {
    return { success: false, error: "This article no longer exists." }
  }

  try {
    const article = await db.article.update({
      where: { id: parsedId.data },
      data: articleData(parsed.data),
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "UPDATE",
      entity: "Article",
      entityId: article.id,
      detail: {
        title: article.title,
        slug: article.slug,
        kind: article.kind,
        published: article.published,
      },
      ip: meta.ip,
    })

    revalidateArticlePaths(article.slug, previous.slug)

    return {
      success: true,
      articleId: article.id,
      message: `Updated ${article.title}.`,
    }
  } catch (error) {
    if (isKnownPrismaError(error, "P2002")) {
      return {
        success: false,
        error: "That slug is already in use. Choose a different slug.",
      }
    }

    if (isKnownPrismaError(error, "P2025")) {
      return { success: false, error: "This article no longer exists." }
    }

    throw error
  }
}

export async function deleteArticle(
  articleId: string
): Promise<ArticleActionResult> {
  const admin = await requireAdmin()
  const parsedId = articleIdSchema.safeParse(articleId)

  if (!parsedId.success) {
    return { success: false, error: "This article id is invalid." }
  }

  try {
    const article = await db.article.delete({ where: { id: parsedId.data } })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "DELETE",
      entity: "Article",
      entityId: article.id,
      detail: {
        title: article.title,
        slug: article.slug,
        kind: article.kind,
      },
      ip: meta.ip,
    })

    revalidateArticlePaths(article.slug)

    return {
      success: true,
      articleId: article.id,
      message: `Deleted ${article.title}.`,
    }
  } catch (error) {
    if (isKnownPrismaError(error, "P2025")) {
      return { success: false, error: "This article no longer exists." }
    }

    throw error
  }
}
