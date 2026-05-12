"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth.utils"
import { ROUTES } from "@/lib/constants/routes.constants"
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

  const { createNewClient } = await import("../services/quote.service")

  if (!raw || typeof raw !== "object")
    return { success: false as const, error: "Invalid input" }
  const { name, email, company_name, phone } = raw as Record<string, unknown>
  if (!name || typeof name !== "string")
    return { success: false as const, error: "Name is required" }

  return createNewClient({
    name,
    email: typeof email === "string" && email ? email : null,
    company_name:
      typeof company_name === "string" && company_name ? company_name : null,
    phone: typeof phone === "string" && phone ? phone : null,
  })
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
