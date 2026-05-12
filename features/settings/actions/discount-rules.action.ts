"use server"

import { revalidatePath } from "next/cache"

import { requireRole } from "@/lib/auth.utils"
import { createClient } from "@/lib/supabase/server.service"
import { discountRuleSchema } from "../schemas/discount-rules.schema"

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

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("discount_rules")
    .select("id")
    .eq("company_id", profile.company_id)
    .single()

  const { error } = existing
    ? await supabase
        .from("discount_rules")
        .update({ threshold_percent: parsed.data.threshold_percent })
        .eq("id", existing.id)
    : await supabase.from("discount_rules").insert({
        company_id: profile.company_id,
        threshold_percent: parsed.data.threshold_percent,
      })

  if (error) return { error: error.message }

  revalidatePath("/admin/discount-rules")
  return { success: true }
}
