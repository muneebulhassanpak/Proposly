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
