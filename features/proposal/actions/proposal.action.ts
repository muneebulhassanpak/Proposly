"use server"

import { z } from "zod"
import { Resend } from "resend"

import { createClient } from "@/lib/supabase/server.service"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import { ACTIVITY_EVENT } from "@/lib/constants/activity-events.constants"
import { USER_ROLES } from "@/lib/constants/roles.constants"

const acceptSchema = z.object({
  quoteId: z.string().uuid(),
  versionId: z.string().uuid(),
})

export async function acceptProposalAction(raw: unknown) {
  const parsed = acceptSchema.safeParse(raw)
  if (!parsed.success)
    return { success: false as const, error: "Invalid input" }

  const { quoteId, versionId } = parsed.data
  const supabase = await createClient()

  // Verify quote is in a state that can be accepted
  const { data: quote } = await supabase
    .from("quotes")
    .select("id, status, created_by, company_id")
    .eq("id", quoteId)
    .single()

  if (!quote) return { success: false as const, error: "Quote not found" }
  if (
    quote.status === QUOTE_STATUS.ACCEPTED ||
    quote.status === QUOTE_STATUS.REJECTED
  ) {
    return {
      success: false as const,
      error: "This proposal has already been decided",
    }
  }

  // Update quote status
  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.ACCEPTED,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)

  // Log activity
  await supabase.from("activity_log").insert({
    quote_id: quoteId,
    version_id: versionId,
    event: ACTIVITY_EVENT.ACCEPTED,
  })

  // Notify rep + all managers
  const { data: managers } = await supabase
    .from("profiles")
    .select("id")
    .eq("company_id", quote.company_id!)
    .in("role", [USER_ROLES.MANAGER, USER_ROLES.ADMIN])

  const notifyIds = [
    ...(quote.created_by ? [quote.created_by] : []),
    ...(managers ?? []).map((m) => m.id),
  ]
  const uniqueIds = [...new Set(notifyIds)]

  if (uniqueIds.length > 0) {
    await supabase.from("notifications").insert(
      uniqueIds.map((uid) => ({
        user_id: uid,
        quote_id: quoteId,
        type: "quote_accepted",
        message: "A proposal has been accepted by the client.",
      }))
    )
  }

  return { success: true as const }
}

const rejectSchema = z.object({
  quoteId: z.string().uuid(),
  versionId: z.string().uuid(),
  reason: z.string().max(500).optional(),
})

export async function rejectProposalAction(raw: unknown) {
  const parsed = rejectSchema.safeParse(raw)
  if (!parsed.success)
    return { success: false as const, error: "Invalid input" }

  const { quoteId, versionId, reason } = parsed.data
  const supabase = await createClient()

  const { data: quote } = await supabase
    .from("quotes")
    .select("id, status, created_by, company_id")
    .eq("id", quoteId)
    .single()

  if (!quote) return { success: false as const, error: "Quote not found" }
  if (
    quote.status === QUOTE_STATUS.ACCEPTED ||
    quote.status === QUOTE_STATUS.REJECTED
  ) {
    return {
      success: false as const,
      error: "This proposal has already been decided",
    }
  }

  await supabase
    .from("quotes")
    .update({
      status: QUOTE_STATUS.REJECTED,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)

  await supabase.from("activity_log").insert({
    quote_id: quoteId,
    version_id: versionId,
    event: ACTIVITY_EVENT.REJECTED_BY_CLIENT,
    meta: reason ? { reason } : null,
  })

  // Notify rep + managers
  const { data: managers } = await supabase
    .from("profiles")
    .select("id")
    .eq("company_id", quote.company_id!)
    .in("role", [USER_ROLES.MANAGER, USER_ROLES.ADMIN])

  const notifyIds = [
    ...(quote.created_by ? [quote.created_by] : []),
    ...(managers ?? []).map((m) => m.id),
  ]
  const uniqueIds = [...new Set(notifyIds)]

  if (uniqueIds.length > 0) {
    await supabase.from("notifications").insert(
      uniqueIds.map((uid) => ({
        user_id: uid,
        quote_id: quoteId,
        type: "quote_rejected",
        message: reason
          ? `A proposal was declined: ${reason}`
          : "A proposal was declined by the client.",
      }))
    )
  }

  return { success: true as const }
}

const questionSchema = z.object({
  quoteId: z.string().uuid(),
  repEmail: z.string().email(),
  quoteTitle: z.string(),
  publicToken: z.string(),
  message: z.string().min(1, "Message is required").max(2000),
})

const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL ?? "Proposly <onboarding@resend.dev>"

export async function askQuestionAction(raw: unknown) {
  const parsed = questionSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }

  const { repEmail, quoteTitle, publicToken, message } = parsed.data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const proposalLink = `${siteUrl}/p/${publicToken}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to: repEmail,
    subject: `Question about proposal: ${quoteTitle}`,
    html: `
<p>A client has a question about <strong>${quoteTitle}</strong>:</p>
<blockquote style="border-left:3px solid #E5DFD4;padding:8px 16px;margin:16px 0;color:#4A433D">${message}</blockquote>
<p><a href="${proposalLink}">View the proposal</a></p>
<p style="color:#7A726A;font-size:12px">Sent via Proposly</p>`,
  })

  if (error)
    return { success: false as const, error: "Failed to send your question." }

  return { success: true as const }
}
