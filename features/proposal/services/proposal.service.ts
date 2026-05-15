import { createClient } from "@/lib/supabase/server.service"
import { QUOTE_STATUS, VERSION_STATUS } from "@/lib/constants/quote.constants"
import { ACTIVITY_EVENT } from "@/lib/constants/activity-events.constants"
import type { ProposalData } from "../proposal.types"

export async function getProposalByToken(
  token: string
): Promise<ProposalData | null> {
  const supabase = await createClient()

  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "id, title, status, created_at, expires_at, currency, created_by, client_id, company_id"
    )
    .eq("public_token", token)
    .single()

  if (!quote) return null

  // Get the latest active version
  const { data: version } = await supabase
    .from("quote_versions")
    .select("id, subtotal, discount_amount, tax_amount, total")
    .eq("quote_id", quote.id)
    .eq("status", VERSION_STATUS.ACTIVE)
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  if (!version) return null

  // Fetch line items, company, client, and rep in parallel
  const [{ data: lineItems }, { data: company }, clientResult, { data: rep }] =
    await Promise.all([
      supabase
        .from("quote_line_items")
        .select("id, name, description, quantity, unit_price, unit, line_total")
        .eq("version_id", version.id)
        .order("sort_order"),
      supabase
        .from("companies")
        .select("name, logo_url, brand_color")
        .eq("id", quote.company_id!)
        .single(),
      quote.client_id
        ? supabase
            .from("clients")
            .select("name, company_name")
            .eq("id", quote.client_id)
            .single()
        : Promise.resolve({ data: null }),
      supabase
        .from("profiles")
        .select("id, email")
        .eq("id", quote.created_by!)
        .single(),
    ])

  const client = clientResult.data

  // Find accepted/rejected timestamps from activity log
  const { data: decisionEvents } = await supabase
    .from("activity_log")
    .select("event, created_at")
    .eq("quote_id", quote.id)
    .in("event", [ACTIVITY_EVENT.ACCEPTED, ACTIVITY_EVENT.REJECTED_BY_CLIENT])
    .order("created_at", { ascending: false })
    .limit(1)

  const decision = decisionEvents?.[0] ?? null

  return {
    quoteId: quote.id,
    publicToken: token,
    quoteNumber: `Q-${quote.id.slice(-6).toUpperCase()}`,
    title: quote.title,
    status: quote.status ?? QUOTE_STATUS.DRAFT,
    issuedAt: quote.created_at ?? new Date().toISOString(),
    expiresAt: quote.expires_at ?? null,
    currency: quote.currency ?? "USD",
    clientName: client?.name ?? null,
    clientCompanyName: client?.company_name ?? null,
    companyName: company?.name ?? "Your Company",
    companyLogoUrl: company?.logo_url ?? null,
    companyBrandColor: company?.brand_color ?? "#1E40D8",
    repId: rep?.id ?? quote.created_by!,
    repEmail: rep?.email ?? null,
    versionId: version.id,
    subtotal: Number(version.subtotal),
    discountAmount: Number(version.discount_amount),
    taxAmount: Number(version.tax_amount),
    total: Number(version.total),
    lineItems: (lineItems ?? []).map((li) => ({
      id: li.id,
      name: li.name,
      description: li.description ?? null,
      quantity: Number(li.quantity),
      unit_price: Number(li.unit_price),
      unit: li.unit ?? null,
      line_total: Number(li.line_total),
    })),
    acceptedAt:
      decision?.event === ACTIVITY_EVENT.ACCEPTED ? decision.created_at : null,
    rejectedAt:
      decision?.event === ACTIVITY_EVENT.REJECTED_BY_CLIENT
        ? decision.created_at
        : null,
  }
}

export async function trackProposalOpened(
  quoteId: string,
  versionId: string,
  repId: string
): Promise<void> {
  const supabase = await createClient()

  // Guard against double-fire
  const { data: existing } = await supabase
    .from("activity_log")
    .select("id")
    .eq("quote_id", quoteId)
    .eq("version_id", versionId)
    .eq("event", ACTIVITY_EVENT.QUOTE_OPENED)
    .limit(1)
    .single()

  if (existing) return

  // Log the open event
  await supabase.from("activity_log").insert({
    quote_id: quoteId,
    version_id: versionId,
    event: ACTIVITY_EVENT.QUOTE_OPENED,
  })

  // Update quote status to opened (only if currently sent)
  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.OPENED,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)
    .eq("status", QUOTE_STATUS.SENT)

  // Update email_log opened_at
  await supabase
    .from("email_log")
    .update({ opened_at: new Date().toISOString() })
    .eq("quote_id", quoteId)
    .is("opened_at", null)

  // Notify the rep
  await supabase.from("notifications").insert({
    user_id: repId,
    quote_id: quoteId,
    type: "quote_opened",
    message: "Your proposal has been opened by the client.",
  })
}
