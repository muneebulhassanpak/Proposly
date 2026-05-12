import { requireAuth } from "@/lib/auth.utils"
import { getDiscountRule } from "@/features/settings/services/discount-rules.service"
import { DiscountRulesPage } from "@/features/settings/pages/discount-rules.page"

export default async function Page() {
  const profile = await requireAuth()
  const rule = await getDiscountRule(profile.company_id!)
  return <DiscountRulesPage rule={rule} />
}
