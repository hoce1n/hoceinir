import { requireAdmin } from "@/lib/auth/session"
import { adminNavFlat } from "@/lib/admin-nav"
import { AdminPlaceholder } from "@/components/admin/admin-placeholder"

export const dynamic = "force-dynamic"

export default async function AdminMessagesPage() {
  await requireAdmin()
  const item = adminNavFlat.find((i) => i.href === "/admin/messages")!
  return <AdminPlaceholder item={item} />
}
