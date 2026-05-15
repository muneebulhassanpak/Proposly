"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth.utils"
import { ROUTES } from "@/lib/constants/routes.constants"
import { createClientSchema } from "../schemas/create-client.schema"
import { saveDraftSchema } from "../schemas/save-draft.schema"
import { saveDraft } from "../services/quote.service"

export async function saveDraftAction(raw: unknown) {
  await requireAuth()

  const parsed = saveDraftSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  const result = await saveDraft(parsed.data)
  if (result.success) {
    revalidatePath(ROUTES.QUOTES)
    revalidatePath(ROUTES.QUOTE(result.quoteId))
  }
  return result
}

export async function createClientAction(raw: unknown) {
  await requireAuth()

  const parsed = createClientSchema.safeParse(raw)
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues[0].message }

  const { createNewClient } = await import("../services/quote.service")
  return createNewClient(parsed.data)
}

export async function searchClientsAction(query: string) {
  await requireAuth()
  const { searchClients } = await import("../services/quote.service")
  return searchClients(query)
}

export async function searchProductsAction(query: string) {
  await requireAuth()
  const { searchProducts } = await import("../services/quote.service")
  return searchProducts(query)
}

export async function getQuoteTemplatesAction() {
  await requireAuth()
  const { getQuoteTemplates } = await import("../services/quote.service")
  return getQuoteTemplates()
}

const requestApprovalInputSchema = z.object({
  quoteId: z.string().uuid(),
  versionId: z.string().uuid(),
})

export async function requestApprovalAction(raw: unknown) {
  const profile = await requireAuth()
  const parsed = requestApprovalInputSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  const { requestApproval } =
    await import("@/features/approvals/services/approval.service")
  return requestApproval(parsed.data, profile.id)
}
