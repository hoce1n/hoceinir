import { z } from "zod"

const paragraphSchema = z
  .string()
  .trim()
  .min(1, "Paragraphs cannot be empty.")
  .max(2000, "Paragraphs must be 2000 characters or fewer.")

export const aboutStatSchema = z.object({
  k: z
    .string()
    .trim()
    .min(1, "Statistic labels cannot be empty.")
    .max(48, "Statistic labels must be 48 characters or fewer."),
  v: z
    .string()
    .trim()
    .min(1, "Statistic values cannot be empty.")
    .max(80, "Statistic values must be 80 characters or fewer."),
})

export const updateAboutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(80, "Name must be 80 characters or fewer."),
  role: z
    .string()
    .trim()
    .min(1, "Role is required.")
    .max(160, "Role must be 160 characters or fewer."),
  loves: z
    .string()
    .trim()
    .min(1, "Loves is required.")
    .max(320, "Loves must be 320 characters or fewer."),
  currently: z
    .string()
    .trim()
    .min(1, "Currently is required.")
    .max(320, "Currently must be 320 characters or fewer."),
  philosophy: z
    .string()
    .trim()
    .min(1, "Philosophy is required.")
    .max(320, "Philosophy must be 320 characters or fewer."),
  paragraphs: z
    .array(paragraphSchema)
    .min(1, "Add at least one paragraph.")
    .max(12, "Use no more than 12 paragraphs."),
  stats: z
    .array(aboutStatSchema)
    .min(1, "Add at least one statistic.")
    .max(8, "Use no more than 8 statistics."),
})

export type UpdateAboutInput = z.infer<typeof updateAboutSchema>
