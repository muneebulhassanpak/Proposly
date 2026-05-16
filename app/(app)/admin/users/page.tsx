import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { UsersPage } from "@/features/settings/pages/users.page"

export default async function Page() {
  await requireRole(USER_ROLES.ADMIN)
  return <UsersPage />
}
