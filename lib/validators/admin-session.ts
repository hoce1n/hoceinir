import { z } from "zod"

export const adminSessionIdSchema = z.string().cuid("Invalid admin session id.")
