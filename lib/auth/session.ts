import { createHash, randomBytes } from "node:crypto"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import type { AdminUser } from "@/lib/generated/prisma/client"
import { SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/auth/constants"

export type Admin = Pick<AdminUser, "id" | "email" | "name" | "role">

export type RequestMeta = {
  ip: string | null
  userAgent: string | null
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  }
}

export async function getRequestMeta(): Promise<RequestMeta> {
  const headerStore = await headers()
  const forwardedFor = headerStore.get("x-forwarded-for")
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : null
  return { ip, userAgent: headerStore.get("user-agent") }
}

export async function createSession(
  userId: string,
  meta?: RequestMeta
): Promise<void> {
  const token = randomBytes(32).toString("base64url")
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await db.adminSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, cookieOptions())
}

export async function getSession(): Promise<Admin | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await db.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })

  if (!session) return null
  if (session.expiresAt.getTime() <= Date.now()) return null
  if (!session.user || !session.user.active) return null

  void db.adminSession.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  })

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await db.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } })
  }
  cookieStore.delete(SESSION_COOKIE)
}

export async function requireAdmin(): Promise<Admin> {
  const admin = await getSession()
  if (!admin) redirect("/admin/login")
  return admin
}
