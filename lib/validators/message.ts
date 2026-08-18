import { z } from "zod"

export const contactMessageIdSchema = z
  .string()
  .cuid("Invalid contact message id.")

export const messageStatusSchema = z.enum(["NEW", "READ", "ARCHIVED"])
