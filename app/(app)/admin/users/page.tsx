import { requireRole } from "@/lib/auth.utils"
import { UsersPage } from "@/features/settings/pages/users.page"

export default async function Page() {
  await requireRole("admin")
  return <UsersPage />
}
