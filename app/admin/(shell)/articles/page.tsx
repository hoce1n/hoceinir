import { requireAdmin } from "@/lib/auth/session"
import { adminNavFlat } from "@/lib/admin-nav"
import { AdminPlaceholder } from "@/components/admin/admin-placeholder"

export const dynamic = "force-dynamic"

export default async function AdminArticlesPage() {
  await requireAdmin()
  const item = adminNavFlat.find((i) => i.href === "/admin/articles")!
  return <AdminPlaceholder item={item} />
}
