import { notFound } from "next/navigation"

import { QuotePreviewPage } from "@/features/quotes/pages/quote-preview.page"
import { getQuotePreview } from "@/features/quotes/services/quote.service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function QuotePreviewRoute({ params }: Props) {
  const { id } = await params
  const quoteData = await getQuotePreview(id)
  if (!quoteData) notFound()
  return <QuotePreviewPage quoteData={quoteData} />
}
