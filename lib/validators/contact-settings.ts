import { z } from "zod"

export const updateContactSettingsSchema = z.object({
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

const socialLinkFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Social name is required.")
    .max(80, "Social name must be 80 characters or fewer."),
  handle: z
    .string()
    .trim()
    .min(1, "Social handle is required.")
    .max(120, "Social handle must be 120 characters or fewer."),
  href: z
    .string()
    .trim()
    .url("Enter a valid social URL.")
    .max(2048, "Social URL must be 2048 characters or fewer."),
  order: z
    .number({ error: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(10000, "Order must be 10000 or fewer."),
})

export const createSocialLinkSchema = socialLinkFieldsSchema
export const updateSocialLinkSchema = socialLinkFieldsSchema
export const socialLinkIdSchema = z.string().cuid("Invalid social link id.")

export type UpdateContactSettingsInput = z.infer<
  typeof updateContactSettingsSchema
>
export type CreateSocialLinkInput = z.infer<typeof createSocialLinkSchema>
export type UpdateSocialLinkInput = z.infer<typeof updateSocialLinkSchema>
