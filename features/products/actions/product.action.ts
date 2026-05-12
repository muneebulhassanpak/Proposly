"use server"

import { requireRole } from "@/lib/auth.utils"
import { productSchema } from "../schemas/product.schema"
import type { ProductFormData } from "../schemas/product.schema"
import {
  createProduct,
  getProductById,
  logPriceChange,
  toggleProductActive,
  updateProduct,
} from "../services/product-mutations.service"

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

  const { error } = await createProduct(parsed.data, profile.company_id)
  if (error) return { success: false, error }
  return { success: true }
}

export async function updateProductAction(
  productId: string,
  data: ProductFormData
): Promise<ProductActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const parsed = productSchema.safeParse(data)
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const current = await getProductById(productId, profile.company_id)
  if (!current) return { success: false, error: "Product not found" }

  const { error } = await updateProduct(
    productId,
    parsed.data,
    profile.company_id
  )
  if (error) return { success: false, error }

  if (parsed.data.unit_price !== current.unit_price) {
    await logPriceChange(
      productId,
      current.unit_price,
      parsed.data.unit_price,
      profile.id
    )
  }

  return { success: true }
}

export async function toggleProductActiveAction(
  productId: string,
  isActive: boolean
): Promise<ProductActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const { error } = await toggleProductActive(
    productId,
    isActive,
    profile.company_id
  )
  if (error) return { success: false, error }
  return { success: true }
}
