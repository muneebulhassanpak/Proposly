import { createClient } from "@/lib/supabase/server.service"
import { DEFAULT_PRODUCT_UNIT } from "@/lib/constants/product.constants"
import { QUOTE_STATUS, VERSION_STATUS } from "../constants/quote.constants"
import type { SaveDraftInput } from "../schemas/save-draft.schema"
import type {
  SaveDraftResult,
  InitialQuoteData,
  LineItemRow,
  QuotePreviewData,
} from "../quotes.types"

export async function searchClients(query: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("clients")
    .select("id, name, email, phone, company_name")
    .ilike("name", `%${query}%`)
    .order("name")
    .limit(10)
  return data ?? []
}

export async function createNewClient(fields: {
  name: string
  email: string | null
  company_name: string | null
  phone: string | null
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false as const, error: "Not authenticated" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single()

  if (!profile?.company_id)
    return { success: false as const, error: "No company" }

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...fields, company_id: profile.company_id })
    .select("id, name, email, phone, company_name")
    .single()

  if (error) return { success: false as const, error: error.message }
  return { success: true as const, client: data }
}

export async function searchProducts(query: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("id, name, unit_price, cost_price, unit, description")
    .eq("is_active", true)
    .ilike("name", `%${query}%`)
    .order("name")
    .limit(10)
  return data ?? []
}

export async function saveDraft(
  input: SaveDraftInput
): Promise<SaveDraftResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, companies(default_currency)")
    .eq("id", user.id)
    .single()
  if (!profile?.company_id) return { success: false, error: "No company" }

  const companyCurrency =
    (profile.companies as { default_currency: string } | null)
      ?.default_currency ?? "USD"

  const subtotal = input.line_items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  )
  const discountAmount = (subtotal * input.discount_percent) / 100
  const taxAmount = ((subtotal - discountAmount) * input.tax_percent) / 100
  const total = subtotal - discountAmount + taxAmount

  if (input.quote_id) {
    // Update existing draft
    const { error: qErr } = await supabase
      .from("quotes")
      .update({
        title: input.title,
        client_id: input.client_id,
        notes: input.notes || null,
        expires_at: input.expires_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.quote_id)
    if (qErr) return { success: false, error: qErr.message }

    const { data: version } = await supabase
      .from("quote_versions")
      .select("id")
      .eq("quote_id", input.quote_id)
      .eq("status", QUOTE_STATUS.DRAFT)
      .order("version_number", { ascending: false })
      .limit(1)
      .single()
    if (!version) return { success: false, error: "Draft version not found" }

    const { error: vUpdateErr } = await supabase
      .from("quote_versions")
      .update({
        subtotal,
        discount_percent: input.discount_percent,
        discount_amount: discountAmount,
        tax_percent: input.tax_percent,
        tax_amount: taxAmount,
        total,
      })
      .eq("id", version.id)
    if (vUpdateErr) return { success: false, error: vUpdateErr.message }

    const { error: deleteErr } = await supabase
      .from("quote_line_items")
      .delete()
      .eq("version_id", version.id)
    if (deleteErr) return { success: false, error: deleteErr.message }

    if (input.line_items.length > 0) {
      const { error: insertErr } = await supabase
        .from("quote_line_items")
        .insert(
          input.line_items.map((item, i) => ({
            version_id: version.id,
            product_id: item.product_id,
            name: item.name,
            description: item.description || null,
            unit_price: item.unit_price,
            cost_price: item.cost_price,
            quantity: item.quantity,
            unit: item.unit || DEFAULT_PRODUCT_UNIT,
            line_total: item.unit_price * item.quantity,
            sort_order: i,
          }))
        )
      if (insertErr) return { success: false, error: insertErr.message }
    }

    return { success: true, quoteId: input.quote_id, versionId: version.id }
  }

  // Create new quote
  const { data: quote, error: qErr } = await supabase
    .from("quotes")
    .insert({
      company_id: profile.company_id,
      client_id: input.client_id,
      created_by: user.id,
      title: input.title,
      status: QUOTE_STATUS.DRAFT,
      currency: companyCurrency,
      notes: input.notes || null,
      expires_at: input.expires_at,
    })
    .select("id")
    .single()
  if (qErr || !quote)
    return { success: false, error: qErr?.message ?? "Failed to create quote" }

  const { data: version, error: vErr } = await supabase
    .from("quote_versions")
    .insert({
      quote_id: quote.id,
      version_number: 1,
      status: QUOTE_STATUS.DRAFT,
      subtotal,
      discount_percent: input.discount_percent,
      discount_amount: discountAmount,
      tax_percent: input.tax_percent,
      tax_amount: taxAmount,
      total,
      created_by: user.id,
    })
    .select("id")
    .single()
  if (vErr || !version)
    return {
      success: false,
      error: vErr?.message ?? "Failed to create version",
    }

  if (input.line_items.length > 0) {
    const { error: insertErr } = await supabase.from("quote_line_items").insert(
      input.line_items.map((item, i) => ({
        version_id: version.id,
        product_id: item.product_id,
        name: item.name,
        description: item.description || null,
        unit_price: item.unit_price,
        cost_price: item.cost_price,
        quantity: item.quantity,
        unit: item.unit || DEFAULT_PRODUCT_UNIT,
        line_total: item.unit_price * item.quantity,
        sort_order: i,
      }))
    )
    if (insertErr) return { success: false, error: insertErr.message }
  }

  return { success: true, quoteId: quote.id, versionId: version.id }
}

export async function getQuoteDraft(
  quoteId: string
): Promise<InitialQuoteData | null> {
  const supabase = await createClient()

  const { data: quote } = await supabase
    .from("quotes")
    .select("title, client_id, notes, expires_at, status")
    .eq("id", quoteId)
    .single()

  if (!quote || quote.status !== QUOTE_STATUS.DRAFT) return null

  const { data: version } = await supabase
    .from("quote_versions")
    .select("id, discount_percent, tax_percent")
    .eq("quote_id", quoteId)
    .eq("status", QUOTE_STATUS.DRAFT)
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  if (!version) return null

  const { data: lineItems } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("version_id", version.id)
    .order("sort_order")

  let client = null
  if (quote.client_id) {
    const { data } = await supabase
      .from("clients")
      .select("id, name, email, phone, company_name")
      .eq("id", quote.client_id)
      .single()
    client = data
  }

  const rows: LineItemRow[] = (lineItems ?? []).map((li, i) => ({
    localId: crypto.randomUUID(),
    product_id: li.product_id ?? null,
    name: li.name,
    description: li.description ?? "",
    unit_price: Number(li.unit_price),
    cost_price: li.cost_price != null ? Number(li.cost_price) : null,
    quantity: Number(li.quantity),
    unit: li.unit ?? DEFAULT_PRODUCT_UNIT,
    sort_order: i,
  }))

  return {
    title: quote.title,
    client_id: quote.client_id ?? null,
    client,
    expires_at: quote.expires_at ?? null,
    notes: quote.notes ?? "",
    line_items: rows,
    discount_percent: Number(version.discount_percent),
    tax_percent: Number(version.tax_percent),
  }
}

export async function getCompanyQuoteSettings() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return { defaultTaxPercent: 0, discountThreshold: null, currency: "USD" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single()

  if (!profile?.company_id)
    return { defaultTaxPercent: 0, discountThreshold: null, currency: "USD" }

  const [{ data: company }, { data: rule }] = await Promise.all([
    supabase
      .from("companies")
      .select("default_tax_percent, default_currency")
      .eq("id", profile.company_id)
      .single(),
    supabase
      .from("discount_rules")
      .select("threshold_percent")
      .eq("company_id", profile.company_id)
      .single(),
  ])

  return {
    defaultTaxPercent: Number(company?.default_tax_percent ?? 0),
    discountThreshold: rule ? Number(rule.threshold_percent) : null,
    currency: company?.default_currency ?? "USD",
  }
}

export async function getQuoteTemplates() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("quote_templates")
    .select("id, name, description")
    .eq("is_active", true)
    .order("name")
  return data ?? []
}

export async function getQuotePreview(
  quoteId: string
): Promise<QuotePreviewData | null> {
  const supabase = await createClient()

  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "id, title, status, created_at, expires_at, currency, public_token, client_id, company_id"
    )
    .eq("id", quoteId)
    .single()

  if (!quote) return null

  const { data: version } = await supabase
    .from("quote_versions")
    .select(
      "id, version_number, subtotal, discount_percent, discount_amount, tax_percent, tax_amount, total"
    )
    .eq("quote_id", quoteId)
    .in("status", [VERSION_STATUS.DRAFT, VERSION_STATUS.ACTIVE])
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  if (!version) return null

  const { data: lineItems } = await supabase
    .from("quote_line_items")
    .select("id, name, description, quantity, unit_price, unit, line_total")
    .eq("version_id", version.id)
    .order("sort_order")

  const [{ data: company }, { data: client }] = await Promise.all([
    supabase
      .from("companies")
      .select("name, logo_url, address, brand_color")
      .eq("id", quote.company_id!)
      .single(),
    quote.client_id
      ? supabase
          .from("clients")
          .select("name, company_name, email")
          .eq("id", quote.client_id)
          .single()
      : Promise.resolve({ data: null }),
  ])

  return {
    quoteId: quote.id,
    publicToken: quote.public_token ?? "",
    quoteNumber: `Q-${quote.id.slice(-6).toUpperCase()}`,
    title: quote.title,
    status: quote.status ?? QUOTE_STATUS.DRAFT,
    issuedAt: quote.created_at ?? new Date().toISOString(),
    expiresAt: quote.expires_at ?? null,
    currency: quote.currency ?? "USD",
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
    discountAmount: Number(version.discount_amount),
    discountPercent: Number(version.discount_percent),
    taxAmount: Number(version.tax_amount),
    taxPercent: Number(version.tax_percent),
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
  }
}
