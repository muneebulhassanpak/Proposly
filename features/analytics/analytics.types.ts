export type DateRangePreset = "7d" | "30d" | "90d" | "year"

export type AnalyticsMetrics = {
  winRate: number
  avgQuoteValue: number
  avgTimeToClose: number
  totalRevenueWon: number
  currency: string
}

export type QuoteVolumePoint = {
  month: string
  count: number
}

export type RevenuePoint = {
  month: string
  won: number
  pipeline: number
}

export type TopProduct = {
  name: string
  count: number
}

export type RepWinRate = {
  name: string
  winRate: number
  sent: number
  accepted: number
}

export type AnalyticsData = {
  metrics: AnalyticsMetrics
  quoteVolume: QuoteVolumePoint[]
  revenue: RevenuePoint[]
  topProducts: TopProduct[]
  repWinRates: RepWinRate[]
}
