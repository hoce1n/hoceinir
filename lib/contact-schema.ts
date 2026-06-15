import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "name required").max(100, "max 100 chars"),
  email: z.string().trim().email("invalid email").max(255, "max 255 chars"),
  message: z.string().trim().min(4, "say a bit more").max(1000, "max 1000 chars"),
});

export type ContactInput = z.infer<typeof contactSchema>;
