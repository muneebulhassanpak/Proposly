import { redirect } from "next/navigation"

import { requireAuth } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { ROUTES } from "@/lib/constants/routes.constants"
import { DashboardPage } from "@/features/dashboard/pages/dashboard.page"

export default async function DashboardRoute() {
  const profile = await requireAuth()

  // Managers and admins use the manager dashboard
  if (
    profile.role === USER_ROLES.MANAGER ||
    profile.role === USER_ROLES.ADMIN
  ) {
    redirect(ROUTES.MANAGER_DASHBOARD)
  }

  return <DashboardPage userId={profile.id} role={profile.role} />
}
