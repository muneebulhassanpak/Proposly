import { createClient as createBrowserClient } from "@/lib/supabase/browser.service"
import { createClient as createServerClient } from "@/lib/supabase/server.service"
import type { PriceHistory, Product } from "../products.types"
import type { ProductFormData } from "../schemas/product.schema"

export async function getProducts(): Promise<Product[]> {
  const supabase = createBrowserClient()
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
  const supabase = createBrowserClient()
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

// --- Server-side mutations (called from server actions only) ---

export async function getProductById(
  productId: string,
  companyId: string
): Promise<Pick<Product, "unit_price"> | null> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from("products")
    .select("unit_price")
    .eq("id", productId)
    .eq("company_id", companyId)
    .single()
  return data
}

export async function createProduct(
  data: ProductFormData,
  companyId: string
): Promise<{ error: string | null }> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("products")
    .insert({ ...data, company_id: companyId })
  return { error: error?.message ?? null }
}

export async function updateProduct(
  productId: string,
  data: ProductFormData,
  companyId: string
): Promise<{ error: string | null }> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("products")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("company_id", companyId)
  return { error: error?.message ?? null }
}

export async function logPriceChange(
  productId: string,
  oldPrice: number,
  newPrice: number,
  changedBy: string
): Promise<void> {
  const supabase = await createServerClient()
  await supabase.from("product_price_history").insert({
    product_id: productId,
    old_price: oldPrice,
    new_price: newPrice,
    changed_by: changedBy,
  })
}

export async function toggleProductActive(
  productId: string,
  isActive: boolean,
  companyId: string
): Promise<{ error: string | null }> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId)
    .eq("company_id", companyId)
  return { error: error?.message ?? null }
}
