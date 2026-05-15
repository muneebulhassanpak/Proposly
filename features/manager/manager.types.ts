export type ManagerSummary = {
  pipelineValue: number
  quotesSent: number
  acceptedThisMonth: number
  winRate: number
  currency: string
}

export type ManagerQuote = {
  id: string
  title: string
  status: string
  hasPendingApproval: boolean
  clientName: string | null
  clientCompanyName: string | null
  repName: string | null
  versionNumber: number
  total: number
  currency: string
  updatedAt: string
  createdAt: string
}
