import { z } from "zod"

const usesItemSchema = z
  .string()
  .trim()
  .min(1, "Uses items cannot be empty.")
  .max(160, "Uses items must be 160 characters or fewer.")

const usesGroupFieldsSchema = z.object({
  group: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(100, "Group name must be 100 characters or fewer."),
  cmd: z
    .string()
    .trim()
    .min(1, "Command is required.")
    .max(160, "Command must be 160 characters or fewer."),
  items: z
    .array(usesItemSchema)
    .min(1, "Add at least one uses item.")
    .max(24, "Use no more than 24 items."),
  order: z
    .number({ error: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(10000, "Order must be 10000 or fewer."),
})

export const createUsesGroupSchema = usesGroupFieldsSchema
export const updateUsesGroupSchema = usesGroupFieldsSchema
export const usesGroupIdSchema = z.string().cuid("Invalid uses group id.")

export type CreateUsesGroupInput = z.infer<typeof createUsesGroupSchema>
export type UpdateUsesGroupInput = z.infer<typeof updateUsesGroupSchema>
