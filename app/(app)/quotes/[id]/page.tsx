import { requireAuth } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
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
  const [settings, initial, profile] = await Promise.all([
    getCompanyQuoteSettings(),
    getQuoteDraft(id),
    requireAuth(),
  ])

  // Draft + rep who owns it — open the builder
  if (initial && profile.role === USER_ROLES.REP) {
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

  // All other cases — show the read-only detail page
  return <QuoteDetailPage quoteId={id} role={profile.role} />
}
