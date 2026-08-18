import { db } from "@/lib/db"
import { Prisma } from "@/lib/generated/prisma/client"

export type ActivityInput = {
  userId?: string | null
  action: string
  entity: string
  entityId?: string | null
  detail?: Prisma.InputJsonValue
  ip?: string | null
}

export async function logActivity(input: ActivityInput): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        detail: input.detail,
        ip: input.ip ?? null,
      },
    })
  } catch (e) {
    console.error("Failed to write activity log:", e)
  }
}
