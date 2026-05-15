export type ApprovalLineItem = {
  id: string
  name: string
  description: string | null
  quantity: number
  unit_price: number
  unit: string | null
  line_total: number
}

export type ApprovalListItem = {
  id: string
  quoteId: string
  quoteTitle: string
  repName: string
  clientName: string | null
  clientCompanyName: string | null
  discountPercent: number
  total: number
  currency: string
  requestedAt: string
}

export type ApprovalDetailData = {
  id: string
  quoteId: string
  quoteTitle: string
  status: string
  repName: string
  requestedAt: string
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
  discountPercent: number
  discountAmount: number
  taxPercent: number
  taxAmount: number
  total: number
  lineItems: ApprovalLineItem[]
  // Margin
  totalCost: number
  grossMarginPercent: number
}
