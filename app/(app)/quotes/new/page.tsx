import { getCompanyQuoteSettings } from "@/features/quotes/services/quote.service"
import { QuoteBuilderPage } from "@/features/quotes/pages/quote-builder.page"

export default async function NewQuotePage() {
  const { defaultTaxPercent, discountThreshold } =
    await getCompanyQuoteSettings()

  return (
    <QuoteBuilderPage
      defaultTaxPercent={defaultTaxPercent}
      discountThreshold={discountThreshold}
    />
  )
}
