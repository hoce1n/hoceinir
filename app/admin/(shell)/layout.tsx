import type { ReactNode } from "react"
import { requireAdmin } from "@/lib/auth/session"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"

export const dynamic = "force-dynamic"

export default async function AdminShellLayout({
  children,
}: {
  children: ReactNode
}) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]" />
      <div className="relative flex min-h-screen">
        <AdminSidebar role={admin.role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar admin={admin} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
