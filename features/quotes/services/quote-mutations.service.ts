import { Resend } from "resend"

import { createClient } from "@/lib/supabase/server.service"
import { QUOTE_STATUS, VERSION_STATUS } from "../constants/quote.constants"

const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL ?? "Proposly <onboarding@resend.dev>"

export async function sendQuote(
  quoteId: string,
  actorId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()

  // Load quote with client + company data
  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "id, title, status, public_token, company_id, client_id, companies(name), clients(name, email)"
    )
    .eq("id", quoteId)
    .single()

  if (!quote) return { success: false, error: "Quote not found" }
  if (quote.status !== QUOTE_STATUS.DRAFT)
    return { success: false, error: "Only draft quotes can be sent" }

  const clientEmail = (quote.clients as { email?: string | null } | null)?.email
  if (!clientEmail)
    return { success: false, error: "Client has no email address" }

  // Get the draft version to promote
  const { data: version } = await supabase
    .from("quote_versions")
    .select("id")
    .eq("quote_id", quoteId)
    .eq("status", VERSION_STATUS.DRAFT)
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  if (!version) return { success: false, error: "No draft version found" }

  // Build email content before making any state changes
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const publicLink = `${siteUrl}/p/${quote.public_token}`
  const companyName =
    (quote.companies as { name?: string } | null)?.name ?? "Your Agency"
  const clientName =
    (quote.clients as { name?: string } | null)?.name ?? "there"

  // Send email first — before updating status so a failure doesn't leave
  // the quote in an inconsistent state
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error: emailErr } = await resend.emails.send({
    from: RESEND_FROM,
    to: clientEmail,
    subject: `${companyName}: ${quote.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1A1714">
        <h1 style="font-size:20px;font-weight:600;margin-bottom:8px">${quote.title}</h1>
        <p style="color:#7A726A;margin-bottom:24px">Hi ${clientName},</p>
        <p style="margin-bottom:24px">${companyName} has sent you a proposal. Click the link below to view it:</p>
        <a href="${publicLink}" style="display:inline-block;background:#1E40D8;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:500">View Proposal</a>
        <p style="margin-top:32px;color:#7A726A;font-size:13px">Or copy this link: ${publicLink}</p>
      </div>
    `,
  })

  if (emailErr)
    return { success: false, error: `Email failed: ${emailErr.message}` }

  // Email succeeded — now promote version and update status
  const { error: vErr } = await supabase
    .from("quote_versions")
    .update({ status: VERSION_STATUS.ACTIVE })
    .eq("id", version.id)
  if (vErr) return { success: false, error: vErr.message }

  const { error: qErr } = await supabase
    .from("quotes")
    .update({ status: QUOTE_STATUS.SENT, updated_at: new Date().toISOString() })
    .eq("id", quoteId)
  if (qErr) return { success: false, error: qErr.message }

  // Log to email_log
  await supabase.from("email_log").insert({
    quote_id: quoteId,
    sent_by: actorId,
    recipient: clientEmail,
    subject: `${companyName}: ${quote.title}`,
    sent_at: new Date().toISOString(),
  })

  // Log activity
  await supabase.from("activity_log").insert({
    quote_id: quoteId,
    version_id: version.id,
    actor_id: actorId,
    event: "quote_sent",
    meta: { recipient: clientEmail },
  })

  return { success: true }
}
