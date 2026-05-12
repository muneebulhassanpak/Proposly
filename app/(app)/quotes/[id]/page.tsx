import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants/routes.constants"
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

  // Not a draft — show builder in edit mode only for drafts
  if (!initial) {
    return (
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href={ROUTES.DASHBOARD}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-ink">Quote Detail</h1>
        <p className="mt-1 text-sm text-ink-mute">Coming soon.</p>
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
