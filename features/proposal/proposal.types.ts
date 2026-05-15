export type ProposalLineItem = {
  id: string
  name: string
  description: string | null
  quantity: number
  unit_price: number
  unit: string | null
  line_total: number
}

export type ProposalData = {
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
  // Company
  companyName: string
  companyLogoUrl: string | null
  companyBrandColor: string
  // Rep (for ask-a-question email)
  repId: string
  repEmail: string | null
  // Version
  versionId: string
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  lineItems: ProposalLineItem[]
  // Decision
  acceptedAt: string | null
  rejectedAt: string | null
}
