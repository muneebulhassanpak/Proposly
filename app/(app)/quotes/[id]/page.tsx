import { QuoteBuilderPage } from "@/features/quotes/pages/quote-builder.page"
import { QuoteDetailPage } from "@/features/quotes/pages/quote-detail.page"
import {
  getCompanyQuoteSettings,
  getQuoteDraft,
} from "@/features/quotes/services/quote.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function QuoteRoute({ params }: Props) {
  const { id } = await params
  const [settings, initial] = await Promise.all([
    getCompanyQuoteSettings(),
    getQuoteDraft(id),
  ])

  // Draft — open the builder
  if (initial) {
    return (
      <QuoteBuilderPage
        defaultTaxPercent={settings.defaultTaxPercent}
        discountThreshold={settings.discountThreshold}
        currency={settings.currency}
        quoteId={id}
        initial={initial}
      />
    )
  }

  // Non-draft — show the detail page
  return <QuoteDetailPage quoteId={id} />
}
