import { createClient } from "@/lib/supabase/browser.service"
import type { PriceHistory, Product } from "../products.types"

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single()

  if (!profile?.company_id) return []

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("name", { ascending: true })

  return data ?? []
}

export async function getPriceHistory(
  productId: string
): Promise<PriceHistory[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("product_price_history")
    .select("*, profiles(full_name)")
    .eq("product_id", productId)
    .order("changed_at", { ascending: false })

  type HistoryRow = NonNullable<typeof data>[number]
  return (data ?? []).map((row: HistoryRow) => ({
    ...row,
    changer_name: (row.profiles as { full_name: string | null } | null)
      ?.full_name,
  }))
}
