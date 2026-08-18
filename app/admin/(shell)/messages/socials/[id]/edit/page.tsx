import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SocialLinkForm } from "@/components/admin/social-link-form"
import { requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

type EditSocialLinkPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditSocialLinkPage({
  params,
}: EditSocialLinkPageProps) {
  await requireAdmin()
  const { id } = await params
  const socialLink = await db.socialLink.findUnique({ where: { id } })

  if (!socialLink) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/admin/messages?view=settings"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> cd ~/contact/socials
      </Link>

      <header className="mt-5 border-b border-border pb-6">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {"// contact · socials · edit"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          <span className="text-muted-foreground">./</span>
          {socialLink.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the public handle, URL, or order for this contact endpoint.
        </p>
      </header>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/20">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/80" />
          <span className="size-2.5 rounded-full bg-secondary/80" />
          <span className="size-2.5 rounded-full bg-primary/80" />
          <p className="ml-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> nano ~/contact/socials/
            {socialLink.id}
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <SocialLinkForm
            mode="edit"
            socialLink={{
              id: socialLink.id,
              name: socialLink.name,
              handle: socialLink.handle,
              href: socialLink.href,
              order: socialLink.order,
            }}
          />
        </div>
      </section>
    </div>
  )
}
