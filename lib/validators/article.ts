import { z } from "zod"

export const articleKindSchema = z.enum(["LOG", "POETRY"])

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160)
}

const optionalTextSchema = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer.`)

const tagSchema = z
  .string()
  .trim()
  .min(1, "Tags cannot be empty.")
  .max(32, "Tags must be 32 characters or fewer.")

const publishedAtSchema = z
  .string()
  .trim()
  .max(64, "Publication date must be 64 characters or fewer.")
  .refine(
    (value) => value.length === 0 || !Number.isNaN(Date.parse(value)),
    "Enter a valid publication date."
  )

const articleFieldsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(160, "Title must be 160 characters or fewer."),
    slug: z
      .string()
      .trim()
      .max(160, "Slug must be 160 characters or fewer.")
      .regex(
        /^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and hyphens only."
      ),
    excerpt: optionalTextSchema(600, "Excerpt"),
    content: z
      .string()
      .trim()
      .min(1, "Markdown content is required.")
      .max(100000, "Content must be 100000 characters or fewer."),
    kind: articleKindSchema,
    tags: z
      .array(tagSchema)
      .max(16, "Use no more than 16 tags.")
      .transform((tags) => Array.from(new Set(tags))),
    readTime: optionalTextSchema(64, "Read time"),
    closer: optionalTextSchema(500, "Closer"),
    published: z.boolean(),
    publishedAt: publishedAtSchema,
    order: z
      .number({ error: "Order must be a number." })
      .int("Order must be a whole number.")
      .min(0, "Order cannot be negative.")
      .max(10000, "Order must be 10000 or fewer."),
  })
  .transform((article) => ({
    ...article,
    slug: article.slug || slugify(article.title),
  }))
  .refine((article) => article.slug.length > 0, {
    path: ["slug"],
    message: "A slug could not be generated from this title.",
  })

export const createArticleSchema = articleFieldsSchema
export const updateArticleSchema = articleFieldsSchema
export const articleIdSchema = z.string().cuid("Invalid article id.")

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
