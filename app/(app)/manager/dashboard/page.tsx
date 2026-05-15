import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { ManagerDashboardPage } from "@/features/manager/pages/manager-dashboard.page"

export default async function ManagerDashboardRoute() {
  const profile = await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  return <ManagerDashboardPage companyId={profile.company_id!} />
}
