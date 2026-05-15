import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { DashboardPage } from "@/features/dashboard/pages/dashboard.page"

export default async function DashboardRoute() {
  const profile = await requireRole(USER_ROLES.REP)

  return <DashboardPage userId={profile.id} role={profile.role} />
}
