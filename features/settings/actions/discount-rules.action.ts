"use server"

import { revalidatePath } from "next/cache"

import { requireRole } from "@/lib/auth.utils"
import { discountRuleSchema } from "../schemas/discount-rules.schema"
import { upsertDiscountRule } from "../services/discount-rules.service"

export type DiscountRuleActionState = {
  error?: string
  success?: boolean
} | null

export async function upsertDiscountRuleAction(
  _prev: DiscountRuleActionState,
  formData: FormData
): Promise<DiscountRuleActionState> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { error: "No company associated with account" }

  const parsed = discountRuleSchema.safeParse({
    threshold_percent: formData.get("threshold_percent"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await upsertDiscountRule(
    profile.company_id,
    parsed.data.threshold_percent
  )

  if (error) return { error }

  revalidatePath("/admin/discount-rules")
  return { success: true }
}
