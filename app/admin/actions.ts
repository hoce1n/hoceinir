"use server"

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/auth/password"
import {
  createSession,
  destroySession,
  getRequestMeta,
  getSession,
} from "@/lib/auth/session"
import { logActivity } from "@/lib/auth/activity"
import { loginSchema } from "@/lib/validators/auth"

export type LoginResult = { error: string }

export async function login(input: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "invalid email or password" }
  }

  const { email, password } = parsed.data
  const meta = await getRequestMeta()

  const user = await db.adminUser.findUnique({ where: { email } })
  if (!user || !user.active) {
    await logActivity({
      action: "LOGIN_FAILED",
      entity: "AdminUser",
      detail: { email },
      ip: meta.ip,
    })
    return { error: "invalid email or password" }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    await logActivity({
      userId: user.id,
      action: "LOGIN_FAILED",
      entity: "AdminUser",
      entityId: user.id,
      detail: { email },
      ip: meta.ip,
    })
    return { error: "invalid email or password" }
  }

  await createSession(user.id, meta)
  await db.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })
  await logActivity({
    userId: user.id,
    action: "LOGIN",
    entity: "AdminUser",
    entityId: user.id,
    detail: { email },
    ip: meta.ip,
  })

  redirect("/admin")
}

export async function logout(): Promise<void> {
  const admin = await getSession()
  await destroySession()
  if (admin) {
    await logActivity({
      userId: admin.id,
      action: "LOGOUT",
      entity: "AdminUser",
      entityId: admin.id,
      detail: { email: admin.email },
    })
  }
  redirect("/admin/login")
}
