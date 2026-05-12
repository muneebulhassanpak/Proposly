import { createClient } from "@/lib/supabase/server.service"
import { DEFAULT_PRODUCT_UNIT } from "@/lib/constants/product.constants"
import { QUOTE_STATUS, VERSION_STATUS } from "../constants/quote.constants"
import { ACTIVITY_EVENT } from "../constants/activity-events.constants"
import type {
  QuoteDetailData,
  QuoteDetailVersion,
  ActivityLogEntry,
  EmailLogEntry,
  QuotePreviewLineItem,
} from "../quotes.types"
import type {
  CreateVersionInput,
  ArchiveVersionInput,
  ExtendExpiryInput,
} from "../schemas/quote-detail.schema"

export async function getQuoteDetail(
  quoteId: string
): Promise<QuoteDetailData | null> {
  const supabase = await createClient()

  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "id, title, status, expires_at, created_at, currency, client_id, clients(name, company_name, email)"
    )
    .eq("id", quoteId)
    .single()

  if (!quote) return null

  const client = quote.clients as {
    name?: string
    company_name?: string
    email?: string
  } | null

  // Fetch all versions with their line items
  const { data: versions } = await supabase
    .from("quote_versions")
    .select(
      "id, version_number, status, subtotal, discount_percent, discount_amount, tax_percent, tax_amount, total, created_at"
    )
    .eq("quote_id", quoteId)
    .order("version_number", { ascending: true })

  const versionRows = versions ?? []

  // Fetch line items for all versions in one query
  const versionIds = versionRows.map((v) => v.id)
  const { data: allLineItems } = versionIds.length
    ? await supabase
        .from("quote_line_items")
        .select(
          "id, version_id, name, description, quantity, unit_price, unit, line_total, sort_order"
        )
        .in("version_id", versionIds)
        .order("sort_order")
    : { data: [] }

  const lineItemsByVersion = new Map<string, QuotePreviewLineItem[]>()
  for (const li of allLineItems ?? []) {
    if (!li.version_id) continue
    const items = lineItemsByVersion.get(li.version_id) ?? []
    items.push({
      id: li.id,
      name: li.name,
      description: li.description ?? null,
      quantity: Number(li.quantity),
      unit_price: Number(li.unit_price),
      unit: li.unit ?? DEFAULT_PRODUCT_UNIT,
      line_total: Number(li.line_total),
    })
    lineItemsByVersion.set(li.version_id, items)
  }

  const detailVersions: QuoteDetailVersion[] = versionRows.map((v) => ({
    id: v.id,
    versionNumber: v.version_number,
    status: v.status ?? VERSION_STATUS.DRAFT,
    subtotal: Number(v.subtotal),
    discountPercent: Number(v.discount_percent),
    discountAmount: Number(v.discount_amount),
    taxPercent: Number(v.tax_percent),
    taxAmount: Number(v.tax_amount),
    total: Number(v.total),
    createdAt: v.created_at ?? new Date().toISOString(),
    lineItems: lineItemsByVersion.get(v.id) ?? [],
  }))

  // Fetch activity log with actor names
  const { data: activities } = await supabase
    .from("activity_log")
    .select(
      "id, event, actor_id, meta, created_at, version_id, profiles(full_name)"
    )
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })

  // Build a version_id → version_number map for display
  const versionNumberMap = new Map<string, number>()
  for (const v of versionRows) {
    versionNumberMap.set(v.id, v.version_number)
  }

  const activityEntries: ActivityLogEntry[] = (activities ?? []).map((a) => ({
    id: a.id,
    event: a.event,
    actorName: (a.profiles as { full_name?: string } | null)?.full_name ?? null,
    createdAt: a.created_at ?? new Date().toISOString(),
    meta: a.meta as Record<string, unknown> | null,
    versionNumber: a.version_id
      ? (versionNumberMap.get(a.version_id) ?? null)
      : null,
  }))

  // Fetch email history
  const { data: emails } = await supabase
    .from("email_log")
    .select("id, recipient, subject, sent_at, opened_at")
    .eq("quote_id", quoteId)
    .order("sent_at", { ascending: false })

  const emailEntries: EmailLogEntry[] = (emails ?? []).map((e) => ({
    id: e.id,
    recipient: e.recipient,
    subject: e.subject ?? null,
    sentAt: e.sent_at ?? new Date().toISOString(),
    openedAt: e.opened_at ?? null,
  }))

  return {
    id: quote.id,
    title: quote.title,
    status: quote.status ?? QUOTE_STATUS.DRAFT,
    expiresAt: quote.expires_at ?? null,
    createdAt: quote.created_at ?? new Date().toISOString(),
    currency: quote.currency ?? "USD",
    clientName: client?.name ?? null,
    clientCompanyName: client?.company_name ?? null,
    clientEmail: client?.email ?? null,
    versions: detailVersions,
    activities: activityEntries,
    emails: emailEntries,
  }
}

export async function createNewVersion(
  input: CreateVersionInput,
  actorId: string
): Promise<
  | { success: true; quoteId: string; versionId: string }
  | { success: false; error: string }
> {
  const supabase = await createClient()

  // Verify quote exists and is not accepted
  const { data: quote } = await supabase
    .from("quotes")
    .select("id, status")
    .eq("id", input.quoteId)
    .single()

  if (!quote) return { success: false, error: "Quote not found" }
  if (quote.status === QUOTE_STATUS.ACCEPTED)
    return {
      success: false,
      error: "Cannot create a new version on an accepted quote",
    }

  // Get latest version (any status) to clone
  const { data: latestVersion } = await supabase
    .from("quote_versions")
    .select(
      "id, version_number, subtotal, discount_percent, discount_amount, tax_percent, tax_amount, total"
    )
    .eq("quote_id", input.quoteId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  if (!latestVersion) return { success: false, error: "No version to clone" }

  // Check if there's already a draft version
  const { data: existingDraft } = await supabase
    .from("quote_versions")
    .select("id")
    .eq("quote_id", input.quoteId)
    .eq("status", VERSION_STATUS.DRAFT)
    .limit(1)
    .single()

  if (existingDraft)
    return { success: false, error: "A draft version already exists" }

  // Supersede the current active version
  await supabase
    .from("quote_versions")
    .update({ status: VERSION_STATUS.SUPERSEDED })
    .eq("quote_id", input.quoteId)
    .eq("status", VERSION_STATUS.ACTIVE)

  // Create new version
  const newVersionNumber = latestVersion.version_number + 1
  const { data: newVersion, error: vErr } = await supabase
    .from("quote_versions")
    .insert({
      quote_id: input.quoteId,
      version_number: newVersionNumber,
      status: VERSION_STATUS.DRAFT,
      subtotal: latestVersion.subtotal,
      discount_percent: latestVersion.discount_percent,
      discount_amount: latestVersion.discount_amount,
      tax_percent: latestVersion.tax_percent,
      tax_amount: latestVersion.tax_amount,
      total: latestVersion.total,
      created_by: actorId,
    })
    .select("id")
    .single()

  if (vErr || !newVersion)
    return {
      success: false,
      error: vErr?.message ?? "Failed to create version",
    }

  // Clone line items
  const { data: sourceItems } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("version_id", latestVersion.id)
    .order("sort_order")

  if (sourceItems && sourceItems.length > 0) {
    await supabase.from("quote_line_items").insert(
      sourceItems.map((item) => ({
        version_id: newVersion.id,
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        unit_price: item.unit_price,
        cost_price: item.cost_price,
        quantity: item.quantity,
        unit: item.unit,
        line_total: item.line_total,
        sort_order: item.sort_order,
      }))
    )
  }

  // Update quote status back to draft
  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.DRAFT,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.quoteId)

  // Log activity
  await supabase.from("activity_log").insert({
    quote_id: input.quoteId,
    version_id: newVersion.id,
    actor_id: actorId,
    event: ACTIVITY_EVENT.VERSION_CREATED,
    meta: { version_number: newVersionNumber },
  })

  return { success: true, quoteId: input.quoteId, versionId: newVersion.id }
}

export async function archiveVersion(
  input: ArchiveVersionInput,
  actorId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  const { data: version } = await supabase
    .from("quote_versions")
    .select("id, version_number, status")
    .eq("id", input.versionId)
    .single()

  if (!version) return { success: false, error: "Version not found" }
  if (version.status === VERSION_STATUS.DRAFT)
    return { success: false, error: "Cannot archive a draft version" }

  const { error } = await supabase
    .from("quote_versions")
    .update({ status: VERSION_STATUS.ARCHIVED })
    .eq("id", input.versionId)

  if (error) return { success: false, error: error.message }

  await supabase.from("activity_log").insert({
    quote_id: input.quoteId,
    version_id: input.versionId,
    actor_id: actorId,
    event: ACTIVITY_EVENT.VERSION_ARCHIVED,
    meta: { version_number: version.version_number },
  })

  return { success: true }
}

export async function extendExpiry(
  input: ExtendExpiryInput,
  actorId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("quotes")
    .update({
      expires_at: input.expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.quoteId)

  if (error) return { success: false, error: error.message }

  await supabase.from("activity_log").insert({
    quote_id: input.quoteId,
    actor_id: actorId,
    event: ACTIVITY_EVENT.EXPIRY_EXTENDED,
    meta: { new_expires_at: input.expiresAt },
  })

  return { success: true }
}
