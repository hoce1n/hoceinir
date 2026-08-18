"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/lib/generated/prisma/client"
import { getRequestMeta, requireAdmin } from "@/lib/auth/session"
import { logActivity } from "@/lib/auth/activity"
import { db } from "@/lib/db"
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "@/lib/validators/project"

export type ProjectActionResult =
  | { success: true; projectId: string; message: string }
  | { success: false; error: string }

function revalidateProjectPaths(projectId?: string): void {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/projects")

  if (projectId) {
    revalidatePath(`/admin/projects/${projectId}/edit`)
  }
}

function projectData(input: {
  title: string
  blurb: string
  tags: string[]
  status: "LIVE" | "WIP" | "ARCHIVED"
  repo: string
  url: string
  order: number
  published: boolean
}) {
  return {
    ...input,
    repo: input.repo || null,
    url: input.url || null,
  }
}

export async function createProject(
  input: unknown
): Promise<ProjectActionResult> {
  const admin = await requireAdmin()
  const parsed = createProjectSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the project fields and try again.",
    }
  }

  const project = await db.project.create({ data: projectData(parsed.data) })
  const meta = await getRequestMeta()

  await logActivity({
    userId: admin.id,
    action: "CREATE",
    entity: "Project",
    entityId: project.id,
    detail: {
      title: project.title,
      status: project.status,
      published: project.published,
    },
    ip: meta.ip,
  })

  revalidateProjectPaths(project.id)

  return {
    success: true,
    projectId: project.id,
    message: `Created ${project.title}.`,
  }
}

export async function updateProject(
  projectId: string,
  input: unknown
): Promise<ProjectActionResult> {
  const admin = await requireAdmin()
  const parsedId = projectIdSchema.safeParse(projectId)
  const parsed = updateProjectSchema.safeParse(input)

  if (!parsedId.success) {
    return { success: false, error: "This project id is invalid." }
  }

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the project fields and try again.",
    }
  }

  try {
    const project = await db.project.update({
      where: { id: parsedId.data },
      data: projectData(parsed.data),
    })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "UPDATE",
      entity: "Project",
      entityId: project.id,
      detail: {
        title: project.title,
        status: project.status,
        published: project.published,
      },
      ip: meta.ip,
    })

    revalidateProjectPaths(project.id)

    return {
      success: true,
      projectId: project.id,
      message: `Updated ${project.title}.`,
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "This project no longer exists." }
    }

    throw error
  }
}

export async function deleteProject(
  projectId: string
): Promise<ProjectActionResult> {
  const admin = await requireAdmin()
  const parsedId = projectIdSchema.safeParse(projectId)

  if (!parsedId.success) {
    return { success: false, error: "This project id is invalid." }
  }

  try {
    const project = await db.project.delete({ where: { id: parsedId.data } })
    const meta = await getRequestMeta()

    await logActivity({
      userId: admin.id,
      action: "DELETE",
      entity: "Project",
      entityId: project.id,
      detail: { title: project.title },
      ip: meta.ip,
    })

    revalidateProjectPaths(project.id)

    return {
      success: true,
      projectId: project.id,
      message: `Deleted ${project.title}.`,
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "This project no longer exists." }
    }

    throw error
  }
}
