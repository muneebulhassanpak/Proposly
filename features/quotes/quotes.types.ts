export type LineItemRow = {
  localId: string
  product_id: string | null
  name: string
  description: string
  unit_price: number
  cost_price: number | null
  quantity: number
  unit: string
  sort_order: number
}

export type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company_name: string | null
}

export type ProductSearchResult = {
  id: string
  name: string
  unit_price: number
  cost_price: number | null
  unit: string | null
  description: string | null
}

export type QuoteBuilderProps = {
  defaultTaxPercent: number
  discountThreshold: number | null
  quoteId?: string
  initial?: InitialQuoteData
}

export type InitialQuoteData = {
  title: string
  client_id: string | null
  client: Client | null
  expires_at: string | null
  notes: string
  line_items: LineItemRow[]
  discount_percent: number
  tax_percent: number
}

export type SaveDraftResult =
  | { success: true; quoteId: string; versionId: string }
  | { success: false; error: string }

export type QuotePreviewLineItem = {
  id: string
  name: string
  description: string | null
  quantity: number
  unit_price: number
  unit: string | null
  line_total: number
}

export type QuotePreviewData = {
  quoteId: string
  publicToken: string
  quoteNumber: string
  title: string
  status: string
  issuedAt: string
  expiresAt: string | null
  currency: string
  // Client
  clientName: string | null
  clientCompanyName: string | null
  clientEmail: string | null
  // Company
  companyName: string
  companyLogoUrl: string | null
  companyAddress: string | null
  companyBrandColor: string
  // Version
  versionId: string
  versionNumber: number
  subtotal: number
  discountAmount: number
  discountPercent: number
  taxAmount: number
  taxPercent: number
  total: number
  lineItems: QuotePreviewLineItem[]
}
