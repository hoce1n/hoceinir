import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("invalid email address")
    .max(254, "max 254 chars"),
  password: z.string().min(8, "password too short").max(128, "max 128 chars"),
})

export type LoginInput = z.infer<typeof loginSchema>
