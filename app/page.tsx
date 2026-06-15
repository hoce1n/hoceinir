import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { About } from "@/components/sections/About";
import { Articles } from "@/components/sections/Articles";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Uses } from "@/components/sections/Uses";
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        skip to content
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Articles />
        <Projects />
        <Uses />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
