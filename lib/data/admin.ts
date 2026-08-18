import os from "node:os"
import { db } from "@/lib/db"

export type AdminStats = {
  projects: number
  articles: number
  logs: number
  poetry: number
  messages: number
  newMessages: number
  usesGroups: number
  socials: number
  users: number
  uptimeSeconds: number
  loadAvg: number[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    projects,
    articles,
    logs,
    poetry,
    messages,
    newMessages,
    usesGroups,
    socials,
    users,
  ] = await Promise.all([
    db.project.count(),
    db.article.count(),
    db.article.count({ where: { kind: "LOG" } }),
    db.article.count({ where: { kind: "POETRY" } }),
    db.contactMessage.count(),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.usesGroup.count(),
    db.socialLink.count(),
    db.adminUser.count(),
  ])

  return {
    projects,
    articles,
    logs,
    poetry,
    messages,
    newMessages,
    usesGroups,
    socials,
    users,
    uptimeSeconds: process.uptime(),
    loadAvg: os.loadavg(),
  }
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const pad = (n: number) => String(n).padStart(2, "0")
  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}
