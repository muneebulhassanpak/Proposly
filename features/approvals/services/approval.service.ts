import { createClient } from "@/lib/supabase/server.service"
import { QUOTE_STATUS, VERSION_STATUS } from "@/lib/constants/quote.constants"
import { ACTIVITY_EVENT } from "@/lib/constants/activity-events.constants"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { APPROVAL_STATUS } from "../constants/approval.constants"
import type { ApprovalListItem, ApprovalDetailData } from "../approvals.types"
import type {
  RequestApprovalInput,
  ApproveInput,
  RejectInput,
} from "../schemas/approval.schema"

// --- Queries ---

export async function getPendingApprovals(
  companyId: string
): Promise<ApprovalListItem[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("approvals")
    .select(
      `id, requested_at,
       quote_versions!inner(
         id, discount_percent, total,
         quote_id,
         quotes!inner(id, title, currency, client_id, company_id,
           clients(name, company_name)
         )
       ),
       profiles!approvals_requested_by_fkey(full_name)`
    )
    .eq("status", APPROVAL_STATUS.PENDING)
    .order("requested_at", { ascending: false })

  // Filter by company_id in JS (nested filter not reliable in PostgREST)
  const items: ApprovalListItem[] = []
  for (const row of data ?? []) {
    const version = row.quote_versions as {
      id: string
      discount_percent: number
      total: number
      quote_id: string
      quotes: {
        id: string
        title: string
        currency: string
        client_id: string | null
        company_id: string
        clients: { name: string; company_name: string | null } | null
      }
    }
    if (version.quotes.company_id !== companyId) continue

    const rep = row.profiles as { full_name: string | null } | null
    const client = version.quotes.clients

    items.push({
      id: row.id,
      quoteId: version.quotes.id,
      quoteTitle: version.quotes.title,
      repName: rep?.full_name ?? "Unknown",
      clientName: client?.name ?? null,
      clientCompanyName: client?.company_name ?? null,
      discountPercent: Number(version.discount_percent),
      total: Number(version.total),
      currency: version.quotes.currency ?? "USD",
      requestedAt: row.requested_at ?? new Date().toISOString(),
    })
  }

  return items
}

export async function getPendingApprovalCount(
  companyId: string
): Promise<number> {
  const supabase = await createClient()

  // Get all quotes in this company
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id")
    .eq("company_id", companyId)

  if (!quotes || quotes.length === 0) return 0

  const quoteIds = quotes.map((q) => q.id)

  // Get version IDs for these quotes
  const { data: versions } = await supabase
    .from("quote_versions")
    .select("id")
    .in("quote_id", quoteIds)

  if (!versions || versions.length === 0) return 0

  const versionIds = versions.map((v) => v.id)

  const { count } = await supabase
    .from("approvals")
    .select("id", { count: "exact", head: true })
    .in("version_id", versionIds)
    .eq("status", APPROVAL_STATUS.PENDING)

  return count ?? 0
}

export async function getApprovalDetail(
  approvalId: string
): Promise<ApprovalDetailData | null> {
  const supabase = await createClient()

  const { data: approval } = await supabase
    .from("approvals")
    .select(
      `id, status, requested_at,
       profiles!approvals_requested_by_fkey(full_name),
       quote_versions!inner(
         id, version_number, subtotal, discount_percent, discount_amount,
         tax_percent, tax_amount, total,
         quote_id,
         quotes!inner(id, title, currency, client_id, company_id,
           clients(name, company_name, email),
           companies(name, logo_url, address, brand_color)
         )
       )`
    )
    .eq("id", approvalId)
    .single()

  if (!approval) return null

  const version = approval.quote_versions as {
    id: string
    version_number: number
    subtotal: number
    discount_percent: number
    discount_amount: number
    tax_percent: number
    tax_amount: number
    total: number
    quote_id: string
    quotes: {
      id: string
      title: string
      currency: string
      client_id: string | null
      company_id: string
      clients: {
        name: string
        company_name: string | null
        email: string | null
      } | null
      companies: {
        name: string
        logo_url: string | null
        address: string | null
        brand_color: string
      } | null
    }
  }

  const rep = approval.profiles as { full_name: string | null } | null
  const client = version.quotes.clients
  const company = version.quotes.companies

  // Fetch line items for margin calculation
  const { data: lineItems } = await supabase
    .from("quote_line_items")
    .select(
      "id, name, description, quantity, unit_price, cost_price, unit, line_total"
    )
    .eq("version_id", version.id)
    .order("sort_order")

  const items = (lineItems ?? []).map((li) => ({
    id: li.id,
    name: li.name,
    description: li.description ?? null,
    quantity: Number(li.quantity),
    unit_price: Number(li.unit_price),
    unit: li.unit ?? null,
    line_total: Number(li.line_total),
  }))

  const totalCost = (lineItems ?? []).reduce(
    (sum, li) => sum + Number(li.cost_price ?? 0) * Number(li.quantity),
    0
  )
  const total = Number(version.total)
  const grossMarginPercent = total > 0 ? ((total - totalCost) / total) * 100 : 0

  return {
    id: approval.id,
    quoteId: version.quotes.id,
    quoteTitle: version.quotes.title,
    status: approval.status ?? APPROVAL_STATUS.PENDING,
    repName: rep?.full_name ?? "Unknown",
    requestedAt: approval.requested_at ?? new Date().toISOString(),
    currency: version.quotes.currency ?? "USD",
    clientName: client?.name ?? null,
    clientCompanyName: client?.company_name ?? null,
    clientEmail: client?.email ?? null,
    companyName: company?.name ?? "Your Company",
    companyLogoUrl: company?.logo_url ?? null,
    companyAddress: company?.address ?? null,
    companyBrandColor: company?.brand_color ?? "#1E40D8",
    versionId: version.id,
    versionNumber: version.version_number,
    subtotal: Number(version.subtotal),
    discountPercent: Number(version.discount_percent),
    discountAmount: Number(version.discount_amount),
    taxPercent: Number(version.tax_percent),
    taxAmount: Number(version.tax_amount),
    total,
    lineItems: items,
    totalCost,
    grossMarginPercent,
  }
}

// --- Mutations ---

export async function requestApproval(
  input: RequestApprovalInput,
  actorId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  // Verify quote is draft and version exists
  const { data: quote } = await supabase
    .from("quotes")
    .select("id, status, company_id")
    .eq("id", input.quoteId)
    .single()

  if (!quote) return { success: false, error: "Quote not found" }
  if (quote.status !== QUOTE_STATUS.DRAFT)
    return {
      success: false,
      error: "Only draft quotes can be submitted for approval",
    }

  // Server-side discount threshold check
  const { data: rule } = await supabase
    .from("discount_rules")
    .select("threshold_percent")
    .eq("company_id", quote.company_id!)
    .single()

  const { data: version } = await supabase
    .from("quote_versions")
    .select("id, discount_percent")
    .eq("id", input.versionId)
    .single()

  if (!version) return { success: false, error: "Version not found" }

  if (
    rule &&
    Number(version.discount_percent) <= Number(rule.threshold_percent)
  ) {
    return {
      success: false,
      error: "Discount does not exceed the approval threshold",
    }
  }

  // Check for existing pending approval on this version
  const { data: existing } = await supabase
    .from("approvals")
    .select("id")
    .eq("version_id", input.versionId)
    .eq("status", APPROVAL_STATUS.PENDING)
    .limit(1)
    .single()

  if (existing)
    return {
      success: false,
      error: "An approval request is already pending for this version",
    }

  // Create approval
  const { error: aErr } = await supabase.from("approvals").insert({
    version_id: input.versionId,
    requested_by: actorId,
    status: APPROVAL_STATUS.PENDING,
  })
  if (aErr) return { success: false, error: aErr.message }

  // Update statuses
  await supabase
    .from("quote_versions")
    .update({ status: VERSION_STATUS.DRAFT })
    .eq("id", input.versionId)

  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.PENDING_APPROVAL,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.quoteId)

  // Log activity
  await supabase.from("activity_log").insert({
    quote_id: input.quoteId,
    version_id: input.versionId,
    actor_id: actorId,
    event: ACTIVITY_EVENT.APPROVAL_REQUESTED,
  })

  // Notify all managers in the company
  const { data: managers } = await supabase
    .from("profiles")
    .select("id")
    .eq("company_id", quote.company_id!)
    .in("role", [USER_ROLES.MANAGER, USER_ROLES.ADMIN])

  if (managers && managers.length > 0) {
    await supabase.from("notifications").insert(
      managers.map((m) => ({
        user_id: m.id,
        quote_id: input.quoteId,
        type: "approval_requested",
        message: "A quote requires your approval.",
      }))
    )
  }

  return { success: true }
}

export async function approveQuote(
  input: ApproveInput,
  reviewerId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data: approval } = await supabase
    .from("approvals")
    .select("id, status, version_id, requested_by")
    .eq("id", input.approvalId)
    .single()

  if (!approval) return { success: false, error: "Approval not found" }
  if (approval.status !== APPROVAL_STATUS.PENDING)
    return { success: false, error: "This approval has already been reviewed" }

  // Update approval
  const { error: aErr } = await supabase
    .from("approvals")
    .update({
      status: APPROVAL_STATUS.APPROVED,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", input.approvalId)
  if (aErr) return { success: false, error: aErr.message }

  // Get quote ID from version
  const { data: version } = await supabase
    .from("quote_versions")
    .select("id, quote_id")
    .eq("id", approval.version_id!)
    .single()

  if (!version) return { success: false, error: "Version not found" }

  // Update version and quote status
  await supabase
    .from("quote_versions")
    .update({ status: VERSION_STATUS.ACTIVE })
    .eq("id", version.id)

  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.APPROVED,
      updated_at: new Date().toISOString(),
    })
    .eq("id", version.quote_id!)

  // Log activity
  await supabase.from("activity_log").insert({
    quote_id: version.quote_id,
    version_id: version.id,
    actor_id: reviewerId,
    event: ACTIVITY_EVENT.APPROVED,
  })

  // Notify the rep
  if (approval.requested_by) {
    await supabase.from("notifications").insert({
      user_id: approval.requested_by,
      quote_id: version.quote_id,
      type: "approval_approved",
      message: "Your quote has been approved.",
    })
  }

  return { success: true }
}

export async function rejectQuote(
  input: RejectInput,
  reviewerId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data: approval } = await supabase
    .from("approvals")
    .select("id, status, version_id, requested_by")
    .eq("id", input.approvalId)
    .single()

  if (!approval) return { success: false, error: "Approval not found" }
  if (approval.status !== APPROVAL_STATUS.PENDING)
    return { success: false, error: "This approval has already been reviewed" }

  // Update approval with rejection note
  const { error: aErr } = await supabase
    .from("approvals")
    .update({
      status: APPROVAL_STATUS.REJECTED,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      note: input.note,
    })
    .eq("id", input.approvalId)
  if (aErr) return { success: false, error: aErr.message }

  // Get quote ID from version
  const { data: version } = await supabase
    .from("quote_versions")
    .select("id, quote_id")
    .eq("id", approval.version_id!)
    .single()

  if (!version) return { success: false, error: "Version not found" }

  // Revert to draft so rep can revise
  await supabase
    .from("quote_versions")
    .update({ status: VERSION_STATUS.DRAFT })
    .eq("id", version.id)

  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.DRAFT,
      updated_at: new Date().toISOString(),
    })
    .eq("id", version.quote_id!)

  // Log activity
  await supabase.from("activity_log").insert({
    quote_id: version.quote_id,
    version_id: version.id,
    actor_id: reviewerId,
    event: ACTIVITY_EVENT.REJECTED,
    meta: { note: input.note },
  })

  // Notify the rep with rejection note
  if (approval.requested_by) {
    await supabase.from("notifications").insert({
      user_id: approval.requested_by,
      quote_id: version.quote_id,
      type: "approval_rejected",
      message: `Your quote was rejected: ${input.note}`,
    })
  }

  return { success: true }
}
