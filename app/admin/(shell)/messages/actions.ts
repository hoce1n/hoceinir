"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/lib/generated/prisma/client"
import { logActivity } from "@/lib/auth/activity"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { contactMessageIdSchema } from "@/lib/validators/message"
import {
  createSocialLinkSchema,
  socialLinkIdSchema,
  updateContactSettingsSchema,
  updateSocialLinkSchema,
} from "@/lib/validators/contact-settings"

export type MessageActionResult =
  | { success: true; messageId: string; message: string }
  | { success: false; error: string }

export type ContactSettingsActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

export type SocialLinkActionResult =
  | { success: true; socialLinkId: string; message: string }
  | { success: false; error: string }

function revalidateMessagePaths(messageId?: string): void {
  revalidatePath("/admin")
  revalidatePath("/admin/messages")

  if (messageId) {
    revalidatePath(`/admin/messages/${messageId}`)
  }
}

function revalidateContactPaths(): void {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/messages")
}

function isMissingRecordError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  )
}

export async function markMessageRead(
  messageId: string
): Promise<MessageActionResult> {
  const admin = await requireAdmin()
  const parsedId = contactMessageIdSchema.safeParse(messageId)

  if (!parsedId.success) {
    return { success: false, error: "This message id is invalid." }
  }

  try {
    const message = await db.contactMessage.update({
      where: { id: parsedId.data },
      data: { status: "READ", readAt: new Date() },
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "MARK_READ",
      entity: "ContactMessage",
      entityId: message.id,
      detail: { name: message.name, email: message.email },
      ip: meta.ip,
    })

    revalidateMessagePaths(message.id)

    return {
      success: true,
      messageId: message.id,
      message: `Marked the message from ${message.name} as read.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This message no longer exists." }
    }

    throw error
  }
}

export async function archiveMessage(
  messageId: string
): Promise<MessageActionResult> {
  const admin = await requireAdmin()
  const parsedId = contactMessageIdSchema.safeParse(messageId)

  if (!parsedId.success) {
    return { success: false, error: "This message id is invalid." }
  }

  try {
    const message = await db.contactMessage.update({
      where: { id: parsedId.data },
      data: { status: "ARCHIVED", readAt: new Date() },
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "ARCHIVE",
      entity: "ContactMessage",
      entityId: message.id,
      detail: { name: message.name, email: message.email },
      ip: meta.ip,
    })

    revalidateMessagePaths(message.id)

    return {
      success: true,
      messageId: message.id,
      message: `Archived the message from ${message.name}.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This message no longer exists." }
    }

    throw error
  }
}

export async function deleteMessage(
  messageId: string
): Promise<MessageActionResult> {
  const admin = await requireAdmin()
  const parsedId = contactMessageIdSchema.safeParse(messageId)

  if (!parsedId.success) {
    return { success: false, error: "This message id is invalid." }
  }

  try {
    const message = await db.contactMessage.delete({
      where: { id: parsedId.data },
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "DELETE",
      entity: "ContactMessage",
      entityId: message.id,
      detail: { name: message.name, email: message.email },
      ip: meta.ip,
    })

    revalidateMessagePaths(message.id)

    return {
      success: true,
      messageId: message.id,
      message: `Deleted the message from ${message.name}.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This message no longer exists." }
    }

    throw error
  }
}

export async function updateContactSettings(
  input: unknown
): Promise<ContactSettingsActionResult> {
  const admin = await requireAdmin()
  const parsed = updateContactSettingsSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the contact settings and try again.",
    }
  }

  try {
    const settings = await db.siteSettings.update({
      where: { id: "site" },
      data: parsed.data,
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "UPDATE",
      entity: "SiteSettings",
      entityId: settings.id,
      detail: { fields: ["tip", "contactIntro"] },
      ip: meta.ip,
    })

    revalidateContactPaths()

    return { success: true, message: "Updated contact settings." }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return {
        success: false,
        error:
          "Site settings are not initialized. Run the database seed first.",
      }
    }

    throw error
  }
}

export async function createSocialLink(
  input: unknown
): Promise<SocialLinkActionResult> {
  const admin = await requireAdmin()
  const parsed = createSocialLinkSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the social link fields and try again.",
    }
  }

  const socialLink = await db.socialLink.create({ data: parsed.data })
  const meta = await getRequestMeta()

  await logActivity({
    userId: admin.id,
    action: "CREATE",
    entity: "SocialLink",
    entityId: socialLink.id,
    detail: { name: socialLink.name, handle: socialLink.handle },
    ip: meta.ip,
  })

  revalidateContactPaths()

  return {
    success: true,
    socialLinkId: socialLink.id,
    message: `Created ${socialLink.name}.`,
  }
}

export async function updateSocialLink(
  socialLinkId: string,
  input: unknown
): Promise<SocialLinkActionResult> {
  const admin = await requireAdmin()
  const parsedId = socialLinkIdSchema.safeParse(socialLinkId)
  const parsed = updateSocialLinkSchema.safeParse(input)

  if (!parsedId.success) {
    return { success: false, error: "This social link id is invalid." }
  }

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the social link fields and try again.",
    }
  }

  try {
    const socialLink = await db.socialLink.update({
      where: { id: parsedId.data },
      data: parsed.data,
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "UPDATE",
      entity: "SocialLink",
      entityId: socialLink.id,
      detail: { name: socialLink.name, handle: socialLink.handle },
      ip: meta.ip,
    })

    revalidateContactPaths()

    return {
      success: true,
      socialLinkId: socialLink.id,
      message: `Updated ${socialLink.name}.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This social link no longer exists." }
    }

    throw error
  }
}

export async function deleteSocialLink(
  socialLinkId: string
): Promise<SocialLinkActionResult> {
  const admin = await requireAdmin()
  const parsedId = socialLinkIdSchema.safeParse(socialLinkId)

  if (!parsedId.success) {
    return { success: false, error: "This social link id is invalid." }
  }

  try {
    const socialLink = await db.socialLink.delete({
      where: { id: parsedId.data },
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "DELETE",
      entity: "SocialLink",
      entityId: socialLink.id,
      detail: { name: socialLink.name, handle: socialLink.handle },
      ip: meta.ip,
    })

    revalidateContactPaths()

    return {
      success: true,
      socialLinkId: socialLink.id,
      message: `Deleted ${socialLink.name}.`,
    }
  } catch (error) {
    if (isMissingRecordError(error)) {
      return { success: false, error: "This social link no longer exists." }
    }

    throw error
  }
}
