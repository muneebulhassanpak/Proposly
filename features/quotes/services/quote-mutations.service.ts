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
    subject: `${companyName} — ${quote.title}`,
    html: buildProposalEmailHtml({
      title: quote.title,
      clientName,
      companyName,
      publicLink,
    }),
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
    subject: `${companyName} — ${quote.title}`,
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

function buildProposalEmailHtml(params: {
  title: string
  clientName: string
  companyName: string
  publicLink: string
}): string {
  const { title, clientName, companyName, publicLink } = params

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F4F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F1EA;padding:48px 24px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center">
              <span style="font-size:18px;font-weight:600;color:#1A1714;font-style:italic;letter-spacing:-0.01em">Proposly</span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:#FFFFFF;border:1px solid #E5DFD4;border-radius:10px;padding:40px 36px">
              <p style="margin:0 0 4px;font-size:13px;color:#7A726A;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">New Proposal</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:600;color:#1A1714;line-height:1.3">${title}</h1>
              <p style="margin:0 0 16px;font-size:15px;color:#1A1714;line-height:1.5">Hi ${clientName},</p>
              <p style="margin:0 0 32px;font-size:15px;color:#4A433D;line-height:1.5">${companyName} has prepared a proposal for you. Click below to review the details.</p>
              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1E40D8;border-radius:6px">
                    <a href="${publicLink}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:500;color:#FFFFFF;text-decoration:none">View Proposal</a>
                  </td>
                </tr>
              </table>
              <!-- Fallback link -->
              <p style="margin:32px 0 0;font-size:12px;color:#7A726A;line-height:1.5;word-break:break-all">Or paste this link in your browser:<br><a href="${publicLink}" style="color:#1E40D8;text-decoration:none">${publicLink}</a></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center">
              <p style="margin:0;font-size:12px;color:#7A726A">Sent via <span style="font-style:italic">Proposly</span> on behalf of ${companyName}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
