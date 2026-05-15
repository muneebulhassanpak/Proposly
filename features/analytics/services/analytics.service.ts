import { createClient } from "@/lib/supabase/browser.service"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import type {
  AnalyticsData,
  QuoteVolumePoint,
  RevenuePoint,
  TopProduct,
  RepWinRate,
} from "../analytics.types"

function getDateRange(preset: string): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString()
  let from: Date

  switch (preset) {
    case "7d":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "90d":
      from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case "year":
      from = new Date(now.getFullYear(), 0, 1)
      break
    case "30d":
    default:
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }

  return { from: from.toISOString(), to }
}

export async function getAnalyticsData(
  companyId: string,
  preset: string
): Promise<AnalyticsData> {
  const supabase = createClient()
  const { from, to } = getDateRange(preset)

  // Fetch all quotes in the date range for this company
  const { data: quotes } = await supabase
    .from("quotes")
    .select(
      `id, status, created_at, updated_at, created_by,
       profiles!quotes_created_by_fkey(full_name),
       quote_versions(total, status)`
    )
    .eq("company_id", companyId)
    .gte("created_at", from)
    .lte("created_at", to)

  const allQuotes = quotes ?? []

  // Fetch company currency
  const { data: company } = await supabase
    .from("companies")
    .select("default_currency")
    .eq("id", companyId)
    .single()

  const currency = company?.default_currency ?? "USD"

  // --- Metrics ---
  const sentStatuses: string[] = [
    QUOTE_STATUS.SENT,
    QUOTE_STATUS.OPENED,
    QUOTE_STATUS.ACCEPTED,
    QUOTE_STATUS.REJECTED,
  ]
  const sentQuotes = allQuotes.filter((q) => sentStatuses.includes(q.status!))
  const acceptedQuotes = allQuotes.filter(
    (q) => q.status === QUOTE_STATUS.ACCEPTED
  )

  const sentCount = sentQuotes.length
  const acceptedCount = acceptedQuotes.length
  const winRate = sentCount > 0 ? (acceptedCount / sentCount) * 100 : 0

  // Get totals from active versions
  function getActiveTotal(q: (typeof allQuotes)[0]): number {
    const versions = (q.quote_versions ?? []) as Array<{
      total: number
      status: string
    }>
    const active = versions.find((v) => v.status === "active")
    return active ? Number(active.total) : 0
  }

  const sentTotals = sentQuotes.map(getActiveTotal)
  const avgQuoteValue =
    sentTotals.length > 0
      ? sentTotals.reduce((a, b) => a + b, 0) / sentTotals.length
      : 0

  // Average time to close (days between created_at and updated_at for accepted)
  const closeTimes = acceptedQuotes
    .filter((q) => q.created_at && q.updated_at)
    .map((q) => {
      const created = new Date(q.created_at!).getTime()
      const updated = new Date(q.updated_at!).getTime()
      return (updated - created) / (1000 * 60 * 60 * 24)
    })
  const avgTimeToClose =
    closeTimes.length > 0
      ? closeTimes.reduce((a, b) => a + b, 0) / closeTimes.length
      : 0

  const totalRevenueWon = acceptedQuotes.reduce(
    (sum, q) => sum + getActiveTotal(q),
    0
  )

  // --- Quote Volume by Month ---
  const volumeMap = new Map<string, number>()
  for (const q of allQuotes) {
    if (!q.created_at) continue
    const d = new Date(q.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    volumeMap.set(key, (volumeMap.get(key) ?? 0) + 1)
  }
  const quoteVolume: QuoteVolumePoint[] = [...volumeMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))

  // --- Revenue: won vs pipeline ---
  const revenueWonMap = new Map<string, number>()
  const revenuePipelineMap = new Map<string, number>()

  for (const q of acceptedQuotes) {
    if (!q.updated_at) continue
    const d = new Date(q.updated_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    revenueWonMap.set(key, (revenueWonMap.get(key) ?? 0) + getActiveTotal(q))
  }

  const pipelineStatuses: string[] = [QUOTE_STATUS.SENT, QUOTE_STATUS.OPENED]
  for (const q of allQuotes.filter((q) =>
    pipelineStatuses.includes(q.status!)
  )) {
    if (!q.created_at) continue
    const d = new Date(q.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    revenuePipelineMap.set(
      key,
      (revenuePipelineMap.get(key) ?? 0) + getActiveTotal(q)
    )
  }

  const allMonths = new Set([
    ...revenueWonMap.keys(),
    ...revenuePipelineMap.keys(),
  ])
  const revenue: RevenuePoint[] = [...allMonths].sort().map((month) => ({
    month,
    won: revenueWonMap.get(month) ?? 0,
    pipeline: revenuePipelineMap.get(month) ?? 0,
  }))

  // --- Top 5 Products ---
  const quoteIds = allQuotes.map((q) => q.id)
  const { data: topProductsData } =
    quoteIds.length > 0
      ? await supabase
          .from("quote_line_items")
          .select("name, quote_versions!inner(quote_id, status)")
          .eq("quote_versions.status", "active")
          .in("quote_versions.quote_id", quoteIds)
      : { data: [] as { name: string }[] }

  const productCounts = new Map<string, number>()
  for (const item of topProductsData ?? []) {
    productCounts.set(item.name, (productCounts.get(item.name) ?? 0) + 1)
  }

  const topProducts: TopProduct[] = [...productCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  // --- Win Rate per Rep ---
  const repStats = new Map<
    string,
    { name: string; sent: number; accepted: number }
  >()
  for (const q of sentQuotes) {
    const rep = q.profiles as { full_name: string | null } | null
    const repName = rep?.full_name ?? "Unknown"
    const repId = q.created_by ?? "unknown"
    if (!repStats.has(repId)) {
      repStats.set(repId, { name: repName, sent: 0, accepted: 0 })
    }
    const stats = repStats.get(repId)!
    stats.sent++
    if (q.status === QUOTE_STATUS.ACCEPTED) stats.accepted++
  }

  const repWinRates: RepWinRate[] = [...repStats.values()]
    .map((r) => ({
      name: r.name,
      sent: r.sent,
      accepted: r.accepted,
      winRate:
        r.sent > 0 ? Math.round((r.accepted / r.sent) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.winRate - a.winRate)

  return {
    metrics: {
      winRate: Math.round(winRate * 10) / 10,
      avgQuoteValue: Math.round(avgQuoteValue * 100) / 100,
      avgTimeToClose: Math.round(avgTimeToClose * 10) / 10,
      totalRevenueWon: Math.round(totalRevenueWon * 100) / 100,
      currency,
    },
    quoteVolume,
    revenue,
    topProducts,
    repWinRates,
  }
}
