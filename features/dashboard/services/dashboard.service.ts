import { createClient } from "@/lib/supabase/browser.service"
import { QUOTE_STATUS, type QuoteStatus } from "@/lib/constants/quote.constants"

import type { DashboardSummary, DashboardQuote } from "../dashboard.types"

export async function getDashboardSummary(
  userId: string
): Promise<DashboardSummary> {
  const supabase = createClient()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [total, sent, accepted, quoteIds] = await Promise.all([
    supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("created_by", userId),
    supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("created_by", userId)
      .in("status", [QUOTE_STATUS.SENT, QUOTE_STATUS.OPENED]),
    supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("created_by", userId)
      .eq("status", QUOTE_STATUS.ACCEPTED)
      .gte("updated_at", startOfMonth.toISOString()),
    supabase.from("quotes").select("id").eq("created_by", userId),
  ])

  // Count pending approvals on this rep's quotes
  let pendingApproval = 0
  const ids = (quoteIds.data ?? []).map((q) => q.id)
  if (ids.length > 0) {
    const { data: versions } = await supabase
      .from("quote_versions")
      .select("id")
      .in("quote_id", ids)
    const versionIds = (versions ?? []).map((v) => v.id)
    if (versionIds.length > 0) {
      const { count } = await supabase
        .from("approvals")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .in("version_id", versionIds)
      pendingApproval = count ?? 0
    }
  }

  return {
    totalQuotes: total.count ?? 0,
    pendingApproval,
    sentCount: sent.count ?? 0,
    acceptedThisMonth: accepted.count ?? 0,
  }
}

/** Sortable columns that map directly to DB fields */
const SORT_COLUMN_MAP: Record<string, string> = {
  title: "title",
  status: "status",
  updatedAt: "updated_at",
}

export interface DashboardQuotesParams {
  userId: string
  search: string
  status: string
  sortBy: string
  sortDesc: boolean
  page: number
  pageSize: number
}

export interface DashboardQuotesResult {
  quotes: DashboardQuote[]
  totalCount: number
}

export async function getDashboardQuotes(
  params: DashboardQuotesParams
): Promise<DashboardQuotesResult> {
  const { userId, search, status, sortBy, sortDesc, page, pageSize } = params
  const supabase = createClient()

  let query = supabase
    .from("quotes")
    .select(
      `id, title, status, updated_at, created_at, currency,
       clients(name, company_name),
       quote_versions(id, version_number, total, status,
         approvals(id, status)
       )`,
      { count: "exact" }
    )
    .eq("created_by", userId)

  // Server-side status filter
  if (status !== "all" && status !== "pending_approval") {
    query = query.eq("status", status as QuoteStatus)
  }

  // Server-side search (title or client name via ilike)
  if (search) {
    query = query.or(`title.ilike.%${search}%,clients.name.ilike.%${search}%`)
  }

  // Server-side sorting
  const dbColumn = SORT_COLUMN_MAP[sortBy]
  if (dbColumn) {
    query = query.order(dbColumn, { ascending: !sortDesc })
  } else {
    query = query.order("updated_at", { ascending: false })
  }

  // Server-side pagination
  const from = page * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, count } = await query

  if (!data) return { quotes: [], totalCount: 0 }

  const mapped = data.map((q) => {
    const versions = (q.quote_versions ?? []) as Array<{
      id: string
      version_number: number
      total: number
      status: string
      approvals: Array<{ id: string; status: string }>
    }>

    // Pick latest version by version_number
    const latest = versions.reduce(
      (best, v) => (v.version_number > (best?.version_number ?? -1) ? v : best),
      versions[0] ?? null
    )

    const hasPendingApproval = versions.some((v) =>
      v.approvals?.some((a) => a.status === "pending")
    )

    const client = q.clients as {
      name: string
      company_name: string | null
    } | null

    return {
      id: q.id,
      title: q.title,
      status: q.status ?? QUOTE_STATUS.DRAFT,
      hasPendingApproval,
      clientName: client?.name ?? null,
      clientCompanyName: client?.company_name ?? null,
      versionNumber: latest?.version_number ?? 1,
      total: Number(latest?.total ?? 0),
      currency: q.currency ?? "USD",
      updatedAt: q.updated_at ?? q.created_at ?? "",
      createdAt: q.created_at ?? "",
    }
  })

  // pending_approval filter must be done client-side since it depends on
  // joined approval data, not a direct column
  const filtered =
    status === "pending_approval"
      ? mapped.filter((q) => q.hasPendingApproval)
      : mapped

  return { quotes: filtered, totalCount: count ?? 0 }
}
