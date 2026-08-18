import { requireAdmin } from "@/lib/auth/session"
import { adminNavFlat } from "@/lib/admin-nav"
import { AdminPlaceholder } from "@/components/admin/admin-placeholder"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  await requireAdmin()
  const item = adminNavFlat.find((i) => i.href === "/admin/projects")!
  return <AdminPlaceholder item={item} />
}
