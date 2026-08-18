import { z } from "zod"

export const projectStatusSchema = z.enum(["LIVE", "WIP", "ARCHIVED"])

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048, "URLs must be 2048 characters or fewer.")
  .refine(
    (value) => value.length === 0 || z.string().url().safeParse(value).success,
    "Enter a valid URL."
  )

const tagSchema = z
  .string()
  .trim()
  .min(1, "Tags cannot be empty.")
  .max(32, "Tags must be 32 characters or fewer.")

const projectFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title must be 120 characters or fewer."),
  blurb: z
    .string()
    .trim()
    .min(1, "Blurb is required.")
    .max(1000, "Blurb must be 1000 characters or fewer."),
  tags: z
    .array(tagSchema)
    .max(16, "Use no more than 16 tags.")
    .transform((tags) => Array.from(new Set(tags))),
  status: projectStatusSchema,
  repo: optionalUrlSchema,
  url: optionalUrlSchema,
  order: z
    .number({ error: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(10000, "Order must be 10000 or fewer."),
  published: z.boolean(),
})

export const createProjectSchema = projectFieldsSchema
export const updateProjectSchema = projectFieldsSchema
export const projectIdSchema = z.string().cuid("Invalid project id.")

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
