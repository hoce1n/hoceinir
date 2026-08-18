import { AboutForm } from "@/components/admin/about-form"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { updateAboutSchema } from "@/lib/validators/about"

export const dynamic = "force-dynamic"

export default async function AdminAboutPage() {
  await requireAdmin()
  const about = await db.aboutSection.findUnique({ where: { id: "about" } })
  const initialAbout = about
    ? updateAboutSchema.parse({
        name: about.name,
        role: about.role,
        loves: about.loves,
        currently: about.currently,
        philosophy: about.philosophy,
        paragraphs: about.paragraphs,
        stats: about.stats,
      })
    : {
        name: "",
        role: "",
        loves: "",
        currently: "",
        philosophy: "",
        paragraphs: [""],
        stats: [{ k: "", v: "" }],
      }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {"// content · about"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          profile editor
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Maintain the singleton profile rendered by{" "}
          <span className="font-mono">./bio.sh --verbose</span> on the public
          homepage.
        </p>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> nano ~/about/bio.sh
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <AboutForm about={initialAbout} />
        </div>
      </section>
    </div>
  )
}
