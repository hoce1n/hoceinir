import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { About } from "@/components/sections/About"
import { Articles } from "@/components/sections/Articles"
import { Contact } from "@/components/sections/Contact"
import { Hero } from "@/components/sections/Hero"
import { Projects } from "@/components/sections/Projects"
import { Uses } from "@/components/sections/Uses"
import { getArticles, getLatestLogArticles } from "@/lib/data/articles"
import {
  getAbout,
  getProjects,
  getSiteSettings,
  getSocials,
  getUsesGroups,
} from "@/lib/data/content"

export const dynamic = "force-dynamic"

export default async function Page() {
  const [site, about, articles, logs, projects, uses, socials] =
    await Promise.all([
      getSiteSettings(),
      getAbout(),
      getArticles(),
      getLatestLogArticles(),
      getProjects(),
      getUsesGroups(),
      getSocials(),
    ])

  const poetry = articles.filter((a) => a.kind === "poetry")

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        skip to content
      </a>
      <SiteHeader
        brandLeft={site.headerBrandLeft}
        brandRight={site.headerBrandRight}
        nav={site.nav}
      />
      <main>
        <Hero
          version={site.version}
          badgeText={site.badgeText}
          heroTitle={site.heroTitle}
          heroSubtitle={site.heroSubtitle}
          stack={site.stack}
        />
        <About data={about} />
        <Articles poetry={poetry} logs={logs} />
        <Projects projects={projects} />
        <Uses groups={uses} />
        <Contact
          socials={socials}
          tip={site.tip}
          contactIntro={site.contactIntro}
        />
      </main>
      <SiteFooter
        socials={socials}
        footerLeft={site.footerLeft}
        footerStatus={site.footerStatus}
        footerRight={site.footerRight}
      />
    </div>
  )
}
