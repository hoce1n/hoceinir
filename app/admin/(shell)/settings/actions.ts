"use server"

import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/auth/activity"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { updateSiteSettingsSchema } from "@/lib/validators/site-settings"

export type SiteSettingsActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

function revalidateSiteSettingsPaths(): void {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/settings")
  revalidatePath("/admin/messages")
}

export async function updateSiteSettings(
  input: unknown
): Promise<SiteSettingsActionResult> {
  const admin = await requireAdmin()
  const parsed = updateSiteSettingsSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the site settings and try again.",
    }
  }

  const settings = await db.siteSettings.upsert({
    where: { id: "site" },
    create: {
      id: "site",
      ...parsed.data,
    },
    update: parsed.data,
  })
  const meta = await getRequestMeta()

  await logActivity({
    userId: admin.id,
    action: "UPDATE",
    entity: "SiteSettings",
    entityId: settings.id,
    detail: {
      fields: [
        "version",
        "heroTitle",
        "heroSubtitle",
        "stack",
        "badgeText",
        "headerBrandLeft",
        "headerBrandRight",
        "nav",
        "footerLeft",
        "footerRight",
        "footerStatus",
        "tip",
        "contactIntro",
      ],
    },
    ip: meta.ip,
  })

  revalidateSiteSettingsPaths()

  return { success: true, message: "Updated site settings." }
}
