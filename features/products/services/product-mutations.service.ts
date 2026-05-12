import { createClient } from "@/lib/supabase/server.service"
import type { ProductFormData } from "../schemas/product.schema"
import type { Product } from "../products.types"

export async function getProductById(
  productId: string,
  companyId: string
): Promise<Pick<Product, "unit_price"> | null> {
  const supabase = await createClient()
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
  const supabase = await createClient()
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
  const supabase = await createClient()
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
  const supabase = await createClient()
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
  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId)
    .eq("company_id", companyId)
  return { error: error?.message ?? null }
}
