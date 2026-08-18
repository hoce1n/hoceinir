"use server"

import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/auth/activity"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { updateAboutSchema } from "@/lib/validators/about"

export type AboutActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

function revalidateAboutPaths(): void {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/about")
}

export async function updateAbout(input: unknown): Promise<AboutActionResult> {
  const admin = await requireAdmin()
  const parsed = updateAboutSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the profile fields and try again.",
    }
  }

  const about = await db.aboutSection.upsert({
    where: { id: "about" },
    create: {
      id: "about",
      ...parsed.data,
    },
    update: parsed.data,
  })
  const meta = await getRequestMeta()

  await logActivity({
    userId: admin.id,
    action: "UPDATE",
    entity: "AboutSection",
    entityId: about.id,
    detail: { name: about.name },
    ip: meta.ip,
  })

  revalidateAboutPaths()

  return { success: true, message: "Updated the about profile." }
}
