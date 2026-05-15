import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { AnalyticsPage } from "@/features/analytics/pages/analytics.page"

export default async function AnalyticsRoute() {
  const profile = await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  return <AnalyticsPage companyId={profile.company_id!} />
}
