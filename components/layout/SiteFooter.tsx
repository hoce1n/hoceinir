import type { SocialLinkItem } from "@/lib/data/content"

export function SiteFooter({
  socials,
  footerLeft,
  footerStatus,
  footerRight,
}: {
  socials: SocialLinkItem[]
  footerLeft: string
  footerStatus: string
  footerRight: string
}) {
  const year = String(new Date().getFullYear())
  const left = footerLeft.replaceAll("{year}", year)

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-8 font-mono text-xs text-muted-foreground sm:grid-cols-[1fr_auto] sm:px-6">
        <div className="space-y-1">
          <p>
            <span className="text-primary">$</span> {left}
          </p>
          <p className="text-muted-foreground/70">
            uptime: ∞ · status:{" "}
            <span className="text-primary">{footerStatus}</span>
          </p>
          {footerRight ? (
            <p className="text-muted-foreground/70">{footerRight}</p>
          ) : null}
        </div>
        <ul className="flex flex-wrap gap-3">
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border px-2.5 py-1 transition-colors hover:border-primary hover:text-primary"
              >
                {s.name.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
