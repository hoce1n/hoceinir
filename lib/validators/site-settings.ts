import { z } from "zod"

const navHrefSchema = z
  .string()
  .trim()
  .min(1, "Navigation href is required.")
  .max(2048, "Navigation href must be 2048 characters or fewer.")
  .refine(
    (href) =>
      href.startsWith("#") ||
      href.startsWith("/") ||
      z.string().url().safeParse(href).success,
    "Navigation href must be a fragment, path, or valid URL."
  )

export const siteNavItemSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Navigation label is required.")
    .max(60, "Navigation labels must be 60 characters or fewer."),
  href: navHrefSchema,
})

export const updateSiteSettingsSchema = z.object({
  version: z
    .string()
    .trim()
    .min(1, "Version is required.")
    .max(80, "Version must be 80 characters or fewer."),
  heroTitle: z
    .string()
    .trim()
    .min(1, "Hero title is required.")
    .max(240, "Hero title must be 240 characters or fewer."),
  heroSubtitle: z
    .string()
    .trim()
    .min(1, "Hero subtitle is required.")
    .max(1200, "Hero subtitle must be 1200 characters or fewer."),
  stack: z
    .string()
    .trim()
    .min(1, "Stack is required.")
    .max(600, "Stack must be 600 characters or fewer."),
  badgeText: z
    .string()
    .trim()
    .min(1, "Badge text is required.")
    .max(80, "Badge text must be 80 characters or fewer."),
  headerBrandLeft: z
    .string()
    .trim()
    .min(1, "Left header brand is required.")
    .max(120, "Left header brand must be 120 characters or fewer."),
  headerBrandRight: z
    .string()
    .trim()
    .min(1, "Right header brand is required.")
    .max(120, "Right header brand must be 120 characters or fewer."),
  nav: z
    .array(siteNavItemSchema)
    .min(1, "Add at least one navigation link.")
    .max(12, "Use no more than 12 navigation links."),
  footerLeft: z
    .string()
    .trim()
    .min(1, "Left footer text is required.")
    .max(500, "Left footer text must be 500 characters or fewer."),
  footerRight: z
    .string()
    .trim()
    .max(500, "Right footer text must be 500 characters or fewer."),
  footerStatus: z
    .string()
    .trim()
    .min(1, "Footer status is required.")
    .max(80, "Footer status must be 80 characters or fewer."),
  tip: z
    .string()
    .trim()
    .min(1, "Tip text is required.")
    .max(500, "Tip text must be 500 characters or fewer."),
  contactIntro: z
    .string()
    .trim()
    .min(1, "Contact intro is required.")
    .max(1200, "Contact intro must be 1200 characters or fewer."),
})

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>
