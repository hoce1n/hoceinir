import { z } from "zod"
import { db } from "@/lib/db"

const statsSchema = z.array(z.object({ k: z.string(), v: z.string() }))
const navSchema = z.array(z.object({ href: z.string(), label: z.string() }))

export type ProjectItem = {
  id: string
  title: string
  blurb: string
  tags: string[]
  status: "live" | "wip" | "archived"
  repo: string | null
  url: string | null
}

export type UsesGroupItem = {
  id: string
  group: string
  cmd: string
  items: string[]
}

export type SocialLinkItem = {
  id: string
  name: string
  handle: string
  href: string
}

export type AboutData = {
  name: string
  role: string
  loves: string
  currently: string
  philosophy: string
  paragraphs: string[]
  stats: { k: string; v: string }[]
}

export type SiteSettingsData = {
  version: string
  heroTitle: string
  heroSubtitle: string
  stack: string
  badgeText: string
  headerBrandLeft: string
  headerBrandRight: string
  nav: { href: string; label: string }[]
  footerLeft: string
  footerRight: string
  footerStatus: string
  tip: string
  contactIntro: string
}

export async function getProjects(): Promise<ProjectItem[]> {
  const rows = await db.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  })
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    blurb: r.blurb,
    tags: r.tags,
    status: r.status.toLowerCase() as ProjectItem["status"],
    repo: r.repo,
    url: r.url,
  }))
}

export async function getUsesGroups(): Promise<UsesGroupItem[]> {
  const rows = await db.usesGroup.findMany({ orderBy: { order: "asc" } })
  return rows.map((r) => ({
    id: r.id,
    group: r.group,
    cmd: r.cmd,
    items: r.items,
  }))
}

export async function getSocials(): Promise<SocialLinkItem[]> {
  const rows = await db.socialLink.findMany({ orderBy: { order: "asc" } })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    handle: r.handle,
    href: r.href,
  }))
}

export async function getAbout(): Promise<AboutData> {
  const row = await db.aboutSection.findUnique({ where: { id: "about" } })
  if (!row) throw new Error("AboutSection missing — run `pnpm prisma db seed`")
  return {
    name: row.name,
    role: row.role,
    loves: row.loves,
    currently: row.currently,
    philosophy: row.philosophy,
    paragraphs: row.paragraphs,
    stats: statsSchema.parse(row.stats),
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await db.siteSettings.findUnique({ where: { id: "site" } })
  if (!row) throw new Error("SiteSettings missing — run `pnpm prisma db seed`")
  return {
    version: row.version,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    stack: row.stack,
    badgeText: row.badgeText,
    headerBrandLeft: row.headerBrandLeft,
    headerBrandRight: row.headerBrandRight,
    nav: navSchema.parse(row.nav),
    footerLeft: row.footerLeft,
    footerRight: row.footerRight,
    footerStatus: row.footerStatus,
    tip: row.tip,
    contactIntro: row.contactIntro,
  }
}
