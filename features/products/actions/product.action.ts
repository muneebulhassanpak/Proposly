"use server"

import { requireRole } from "@/lib/auth.utils"
import { createClient } from "@/lib/supabase/server.service"
import { productSchema } from "../schemas/product.schema"
import type { ProductFormData } from "../schemas/product.schema"

export type ProductActionResult = { success: boolean; error?: string }

export async function createProductAction(
  data: ProductFormData
): Promise<ProductActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const parsed = productSchema.safeParse(data)
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from("products").insert({
    ...parsed.data,
    company_id: profile.company_id,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateProductAction(
  productId: string,
  data: ProductFormData
): Promise<ProductActionResult> {
  const profile = await requireRole("admin")

  const parsed = productSchema.safeParse(data)
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createClient()

  // Fetch current price to detect changes
  const { data: current } = await supabase
    .from("products")
    .select("unit_price")
    .eq("id", productId)
    .eq("company_id", profile.company_id!)
    .single()

  if (!current) return { success: false, error: "Product not found" }

  const { error } = await supabase
    .from("products")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("company_id", profile.company_id!)

  if (error) return { success: false, error: error.message }

  // Log price history if unit_price changed
  if (parsed.data.unit_price !== current.unit_price) {
    await supabase.from("product_price_history").insert({
      product_id: productId,
      old_price: current.unit_price,
      new_price: parsed.data.unit_price,
      changed_by: profile.id,
    })
  }

  return { success: true }
}

export async function toggleProductActiveAction(
  productId: string,
  isActive: boolean
): Promise<ProductActionResult> {
  const profile = await requireRole("admin")

  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId)
    .eq("company_id", profile.company_id!)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
