import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { getCompanyQuoteSettings } from "@/features/quotes/services/quote.service"
import { QuoteBuilderPage } from "@/features/quotes/pages/quote-builder.page"

export default async function NewQuotePage() {
  await requireRole(USER_ROLES.REP)
  const { defaultTaxPercent, discountThreshold, currency } =
    await getCompanyQuoteSettings()

  return (
    <QuoteBuilderPage
      defaultTaxPercent={defaultTaxPercent}
      discountThreshold={discountThreshold}
      currency={currency}
    />
  )
}
