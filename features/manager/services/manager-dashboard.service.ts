import { createClient } from "@/lib/supabase/browser.service"
import { QUOTE_STATUS, type QuoteStatus } from "@/lib/constants/quote.constants"

import type { ManagerSummary, ManagerQuote } from "../manager.types"

export async function getManagerSummary(
  companyId: string
): Promise<ManagerSummary> {
  const supabase = createClient()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [sentResult, acceptedResult, pipelineResult, companyResult] =
    await Promise.all([
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("company_id", companyId)
        .in("status", [
          QUOTE_STATUS.SENT,
          QUOTE_STATUS.OPENED,
          QUOTE_STATUS.ACCEPTED,
          QUOTE_STATUS.REJECTED,
        ]),
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("status", QUOTE_STATUS.ACCEPTED)
        .gte("updated_at", startOfMonth.toISOString()),
      supabase
        .from("quotes")
        .select("id, quote_versions(total, status)")
        .eq("company_id", companyId)
        .in("status", [
          QUOTE_STATUS.SENT,
          QUOTE_STATUS.OPENED,
          QUOTE_STATUS.APPROVED,
          QUOTE_STATUS.PENDING_APPROVAL,
        ]),
      supabase
        .from("companies")
        .select("default_currency")
        .eq("id", companyId)
        .single(),
    ])

  const sentCount = sentResult.count ?? 0
  const acceptedCount = acceptedResult.count ?? 0
  const winRate = sentCount > 0 ? (acceptedCount / sentCount) * 100 : 0

  // Sum totals from active versions of pipeline quotes
  let pipelineValue = 0
  for (const q of pipelineResult.data ?? []) {
    const versions = (q.quote_versions ?? []) as Array<{
      total: number
      status: string
    }>
    const active = versions.find((v) => v.status === "active")
    if (active) pipelineValue += Number(active.total)
  }

  return {
    pipelineValue,
    quotesSent: sentCount,
    acceptedThisMonth: acceptedCount,
    winRate: Math.round(winRate * 10) / 10,
    currency: companyResult.data?.default_currency ?? "USD",
  }
}

const SORT_COLUMN_MAP: Record<string, string> = {
  title: "title",
  status: "status",
  updatedAt: "updated_at",
}

export interface ManagerQuotesParams {
  companyId: string
  search: string
  status: string
  sortBy: string
  sortDesc: boolean
  page: number
  pageSize: number
}

export interface ManagerQuotesResult {
  quotes: ManagerQuote[]
  totalCount: number
}

export async function getManagerQuotes(
  params: ManagerQuotesParams
): Promise<ManagerQuotesResult> {
  const { companyId, search, status, sortBy, sortDesc, page, pageSize } = params
  const supabase = createClient()

  let query = supabase
    .from("quotes")
    .select(
      `id, title, status, updated_at, created_at, currency,
       clients(name, company_name),
       profiles!quotes_created_by_fkey(full_name),
       quote_versions(id, version_number, total, status,
         approvals(id, status)
       )`,
      { count: "exact" }
    )
    .eq("company_id", companyId)

  if (status !== "all" && status !== "pending_approval") {
    query = query.eq("status", status as QuoteStatus)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,clients.name.ilike.%${search}%`)
  }

  const dbColumn = SORT_COLUMN_MAP[sortBy]
  if (dbColumn) {
    query = query.order(dbColumn, { ascending: !sortDesc })
  } else {
    query = query.order("updated_at", { ascending: false })
  }

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

    const rep = q.profiles as { full_name: string | null } | null

    return {
      id: q.id,
      title: q.title,
      status: q.status ?? QUOTE_STATUS.DRAFT,
      hasPendingApproval,
      clientName: client?.name ?? null,
      clientCompanyName: client?.company_name ?? null,
      repName: rep?.full_name ?? null,
      versionNumber: latest?.version_number ?? 1,
      total: Number(latest?.total ?? 0),
      currency: q.currency ?? "USD",
      updatedAt: q.updated_at ?? q.created_at ?? "",
      createdAt: q.created_at ?? "",
    }
  })

  if (sortBy === "total" || sortBy === "clientName") {
    mapped.sort((a, b) => {
      const aVal = a[sortBy] ?? ""
      const bVal = b[sortBy] ?? ""
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDesc ? bVal - aVal : aVal - bVal
      }
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDesc ? -cmp : cmp
    })
  }

  const filtered =
    status === "pending_approval"
      ? mapped.filter((q) => q.hasPendingApproval)
      : mapped

  return { quotes: filtered, totalCount: count ?? 0 }
}
