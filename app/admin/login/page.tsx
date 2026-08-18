import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth/session"
import { LoginForm } from "./login-form"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  const admin = await getSession()
  if (admin) redirect("/admin")

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-secondary/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
              <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
                ssh — admin@hocein
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <p className="font-mono text-sm">
                <span className="text-primary">hocein@admin</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-accent">~</span>
                <span className="text-muted-foreground">$ </span>
                <span className="text-foreground">ssh admin@hocein</span>
              </p>

              <div className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
                <p>connecting to hocein.ir...</p>
                <p>
                  auth method: <span className="text-primary">password</span>
                </p>
              </div>

              <div className="mt-6">
                <LoginForm />
              </div>

              <div className="mt-6 flex items-center justify-between font-mono text-xs">
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  cd ~/
                </Link>
                <span className="text-muted-foreground/70">
                  v1 · restricted area
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
