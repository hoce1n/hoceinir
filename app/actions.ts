'use server';

import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { db } from "@/lib/db";
import { ContactEmailTemplate } from "@/components/email-template";

export type SubmitContactResult =
  | { success: true; firstName: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitContactForm(input: unknown): Promise<SubmitContactResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = parsed.data;

  try {
    await db.contactMessage.create({ data: { name, email, message } });
  } catch (e) {
    console.error("Failed to save contact message:", e);
    return { success: false, error: "Could not save your message. Please try again later." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const to = process.env.CONTACT_TO_EMAIL ?? "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `New contact message from ${name}`,
      replyTo: email,
      react: ContactEmailTemplate({ name, email, message }),
    });

    if (error) {
      console.error("Resend delivery error:", error);
      return { success: false, error: "Message saved, but email delivery failed. We'll follow up on it." };
    }
  } catch (e) {
    console.error("Failed to send contact email:", e);
    return { success: false, error: "Message saved, but email delivery failed. We'll follow up on it." };
  }

  return { success: true, firstName: name.trim().split(/\s+/)[0] ?? name };
}
