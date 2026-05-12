import { createClient } from "@/lib/supabase/server.service"
import type { DiscountRule } from "../settings.types"

export async function getDiscountRule(
  companyId: string
): Promise<DiscountRule | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("discount_rules")
    .select("*")
    .eq("company_id", companyId)
    .single()
  return data
}

export async function upsertDiscountRule(
  companyId: string,
  thresholdPercent: number
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("discount_rules")
    .select("id")
    .eq("company_id", companyId)
    .single()

  const { error } = existing
    ? await supabase
        .from("discount_rules")
        .update({ threshold_percent: thresholdPercent })
        .eq("id", existing.id)
    : await supabase
        .from("discount_rules")
        .insert({ company_id: companyId, threshold_percent: thresholdPercent })

  return { error: error?.message ?? null }
}
