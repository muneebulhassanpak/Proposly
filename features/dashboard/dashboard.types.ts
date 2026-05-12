export type DashboardSummary = {
  totalQuotes: number
  pendingApproval: number
  sentCount: number
  acceptedThisMonth: number
}

export type DashboardQuote = {
  id: string
  title: string
  status: string
  hasPendingApproval: boolean
  clientName: string | null
  clientCompanyName: string | null
  versionNumber: number
  total: number
  currency: string
  updatedAt: string
  createdAt: string
}
