import { requireAuth } from "@/lib/auth.utils"
import { DashboardPage } from "@/features/dashboard/pages/dashboard.page"

export default async function DashboardRoute() {
  const profile = await requireAuth()
  return <DashboardPage userId={profile.id} role={profile.role} />
}
