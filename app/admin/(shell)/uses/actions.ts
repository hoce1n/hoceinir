"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/lib/generated/prisma/client"
import { logActivity } from "@/lib/auth/activity"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import {
  createUsesGroupSchema,
  updateUsesGroupSchema,
  usesGroupIdSchema,
} from "@/lib/validators/uses"

export type UsesActionResult =
  | { success: true; usesGroupId: string; message: string }
  | { success: false; error: string }

function revalidateUsesPaths(usesGroupId?: string): void {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/uses")

  if (usesGroupId) {
    revalidatePath(`/admin/uses/${usesGroupId}/edit`)
  }
}

function isMissingRecordError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  )
}

export async function createUsesGroup(
  input: unknown
): Promise<UsesActionResult> {
  const admin = await requireAdmin()
  const parsed = createUsesGroupSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the uses group fields and try again.",
    }
  }

  const usesGroup = await db.usesGroup.create({ data: parsed.data })
  const meta = await getRequestMeta()

  await logActivity({
    userId: admin.id,
    action: "CREATE",
    entity: "UsesGroup",
    entityId: usesGroup.id,
    detail: { group: usesGroup.group, cmd: usesGroup.cmd },
    ip: meta.ip,
  })

  revalidateUsesPaths(usesGroup.id)

  return {
    success: true,
    usesGroupId: usesGroup.id,
    message: `Created ${usesGroup.group}.`,
  }
}

export async function updateUsesGroup(
  usesGroupId: string,
  input: unknown
): Promise<UsesActionResult> {
  const admin = await requireAdmin()
  const parsedId = usesGroupIdSchema.safeParse(usesGroupId)
  const parsed = updateUsesGroupSchema.safeParse(input)

  if (!parsedId.success) {
    return { success: false, error: "This uses group id is invalid." }
  }

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the uses group fields and try again.",
    }
  }

  try {
    const usesGroup = await db.usesGroup.update({
      where: { id: parsedId.data },
      data: parsed.data,
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "UPDATE",
      entity: "UsesGroup",
      entityId: usesGroup.id,
      detail: { group: usesGroup.group, cmd: usesGroup.cmd },
      ip: meta.ip,
    })

    revalidateUsesPaths(usesGroup.id)

    return {
      success: true,
      usesGroupId: usesGroup.id,
      message: `Updated ${usesGroup.group}.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This uses group no longer exists." }
    }

    throw error
  }
}

export async function deleteUsesGroup(
  usesGroupId: string
): Promise<UsesActionResult> {
  const admin = await requireAdmin()
  const parsedId = usesGroupIdSchema.safeParse(usesGroupId)

  if (!parsedId.success) {
    return { success: false, error: "This uses group id is invalid." }
  }

  try {
    const usesGroup = await db.usesGroup.delete({
      where: { id: parsedId.data },
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "DELETE",
      entity: "UsesGroup",
      entityId: usesGroup.id,
      detail: { group: usesGroup.group, cmd: usesGroup.cmd },
      ip: meta.ip,
    })

    revalidateUsesPaths(usesGroup.id)

    return {
      success: true,
      usesGroupId: usesGroup.id,
      message: `Deleted ${usesGroup.group}.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This uses group no longer exists." }
    }

    throw error
  }
}
