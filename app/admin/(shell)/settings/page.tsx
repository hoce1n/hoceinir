import { SiteSettingsForm } from "@/components/admin/site-settings-form"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { updateSiteSettingsSchema } from "@/lib/validators/site-settings"

export const dynamic = "force-dynamic"

const defaultSettings = {
  version: "v1.0.0",
  heroTitle: "Learning by building.",
  heroSubtitle: "Hi, I'm a developer who enjoys building modern applications.",
  stack: "next · ts · tailwind · prisma · postgres",
  badgeText: "online",
  headerBrandLeft: "~/portfolio",
  headerBrandRight: "portfolio.exe",
  nav: [
    { href: "#about", label: "about" },
    { href: "#articles", label: "articles" },
    { href: "#projects", label: "projects" },
    { href: "#uses", label: "uses" },
    { href: "#contact", label: "contact" },
  ],
  footerLeft: 'echo "© {year} — built with caffeine and chmod"',
  footerRight: "",
  footerStatus: "healthy",
  tip: "I usually reply within 24h.",
  contactIntro:
    "Got an idea, a server on fire, or just want to nerd out? Drop a message.",
}

export default async function AdminSettingsPage() {
  await requireAdmin()
  const settings = await db.siteSettings.findUnique({ where: { id: "site" } })
  const initialSettings = settings
    ? updateSiteSettingsSchema.parse({
        version: settings.version,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        stack: settings.stack,
        badgeText: settings.badgeText,
        headerBrandLeft: settings.headerBrandLeft,
        headerBrandRight: settings.headerBrandRight,
        nav: settings.nav,
        footerLeft: settings.footerLeft,
        footerRight: settings.footerRight,
        footerStatus: settings.footerStatus,
        tip: settings.tip,
        contactIntro: settings.contactIntro,
      })
    : defaultSettings

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {"// configuration · site settings"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          public interface config
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Configure the header, hero, navigation, footer, and contact copy from
          one versioned public-site singleton.
        </p>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> nano ~/config/site.conf
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <SiteSettingsForm settings={initialSettings} />
        </div>
      </section>
    </div>
  )
}
