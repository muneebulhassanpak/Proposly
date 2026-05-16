import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { getDiscountRule } from "@/features/settings/services/discount-rules.service"
import { DiscountRulesPage } from "@/features/settings/pages/discount-rules.page"

export default async function Page() {
  const profile = await requireRole(USER_ROLES.ADMIN)
  const rule = await getDiscountRule(profile.company_id!)
  return <DiscountRulesPage rule={rule} />
}
