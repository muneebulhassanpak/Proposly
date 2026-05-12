"use server"

import { requireAuth } from "@/lib/auth.utils"
import { sendQuoteSchema } from "../schemas/send-quote.schema"
import { sendQuote } from "../services/quote-mutations.service"

export async function sendQuoteAction(raw: unknown) {
  const profile = await requireAuth()

  const parsed = sendQuoteSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  return sendQuote(parsed.data.quoteId, profile.id)
}
