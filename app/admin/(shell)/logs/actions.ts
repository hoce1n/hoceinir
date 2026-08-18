"use server"

import { revalidatePath } from "next/cache"
import { logActivity } from "@/lib/auth/activity"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { adminSessionIdSchema } from "@/lib/validators/admin-session"

export type RevokeSessionResult =
  | { success: true; message: string }
  | { success: false; error: string }

export async function revokeSession(
  sessionId: string
): Promise<RevokeSessionResult> {
  const admin = await requireAdmin()
  const parsedId = adminSessionIdSchema.safeParse(sessionId)

  if (!parsedId.success) {
    return { success: false, error: "This session id is invalid." }
  }

  const session = await db.adminSession.findUnique({
    where: { id: parsedId.data },
    select: {
      id: true,
      userId: true,
      ip: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!session) {
    return { success: false, error: "This session no longer exists." }
  }

  if (admin.role !== "OWNER" && session.userId !== admin.id) {
    return {
      success: false,
      error: "You can only revoke sessions that belong to your account.",
    }
  }

  await db.adminSession.delete({ where: { id: session.id } })
  const meta = await getRequestMeta()

  await logActivity({
    userId: admin.id,
    action: "REVOKE_SESSION",
    entity: "AdminSession",
    entityId: session.id,
    detail: {
      sessionUserId: session.userId,
      sessionUser: session.user?.email ?? null,
      sessionIp: session.ip,
    },
    ip: meta.ip,
  })

  revalidatePath("/admin")
  revalidatePath("/admin/logs")

  return {
    success: true,
    message: `Revoked the session for ${session.user?.name ?? "this admin"}.`,
  }
}
