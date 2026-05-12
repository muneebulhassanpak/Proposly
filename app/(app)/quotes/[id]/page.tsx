import { QuoteBuilderPage } from "@/features/quotes/pages/quote-builder.page"
import {
  getCompanyQuoteSettings,
  getQuoteDraft,
} from "@/features/quotes/services/quote.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function QuoteDetailPage({ params }: Props) {
  const { id } = await params
  const [settings, initial] = await Promise.all([
    getCompanyQuoteSettings(),
    getQuoteDraft(id),
  ])

  // Not a draft — show builder in edit mode only for drafts; otherwise Sprint 04
  if (!initial) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-ink">Quote Detail</h1>
        <p className="mt-1 text-sm text-ink-mute">Coming in Sprint 4.</p>
      </div>
    )
  }

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
