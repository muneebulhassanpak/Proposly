"use server"

import { requireAuth } from "@/lib/auth.utils"
import {
  createVersionSchema,
  archiveVersionSchema,
  extendExpirySchema,
} from "../schemas/quote-detail.schema"
import {
  createNewVersion,
  archiveVersion,
  extendExpiry,
  getQuoteDetail,
} from "../services/quote-detail.service"
import type { QuoteDetailData } from "../quotes.types"

export async function fetchQuoteDetailAction(
  quoteId: string
): Promise<QuoteDetailData | null> {
  await requireAuth()
  return getQuoteDetail(quoteId)
}

export async function createVersionAction(raw: unknown) {
  const profile = await requireAuth()
  const parsed = createVersionSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  return createNewVersion(parsed.data, profile.id)
}

export async function archiveVersionAction(raw: unknown) {
  const profile = await requireAuth()
  const parsed = archiveVersionSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  return archiveVersion(parsed.data, profile.id)
}

export async function extendExpiryAction(raw: unknown) {
  const profile = await requireAuth()
  const parsed = extendExpirySchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  return extendExpiry(parsed.data, profile.id)
}
