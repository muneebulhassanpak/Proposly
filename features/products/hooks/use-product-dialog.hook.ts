"use client"

import { useState } from "react"

import {
  DEFAULT_PRODUCT_UNIT,
  PRODUCT_UNITS,
} from "../constants/product.constants"
import { useCreateProduct, useUpdateProduct } from "./use-products.hook"
import type { ProductFormData } from "../schemas/product.schema"
import type { ProductUnit } from "../constants/product.constants"
import type { Product } from "../products.types"

const DEFAULT_FORM: ProductFormData = {
  name: "",
  description: null,
  category: null,
  unit: DEFAULT_PRODUCT_UNIT,
  unit_price: 0,
  cost_price: null,
  is_active: true,
}

export function useProductDialog(
  product: Product | null | undefined,
  onClose: () => void
) {
  const isEdit = !!product
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const isPending = create.isPending || update.isPending

  const [form, setForm] = useState<ProductFormData>(() =>
    product
      ? {
          name: product.name,
          description: product.description,
          category: product.category,
          unit: (PRODUCT_UNITS.includes(product.unit as ProductUnit)
            ? product.unit
            : DEFAULT_PRODUCT_UNIT) as ProductUnit,
          unit_price: product.unit_price,
          cost_price: product.cost_price,
          is_active: product.is_active ?? true,
        }
      : DEFAULT_FORM
  )

  function set<K extends keyof ProductFormData>(
    key: K,
    val: ProductFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const mutation = isEdit
      ? update.mutate(
          { productId: product!.id, data: form },
          { onSuccess: (r) => r.success && onClose() }
        )
      : create.mutate(form, {
          onSuccess: (r) => r.success && onClose(),
        })
    void mutation
  }

  return { form, set, handleSubmit, isPending, isEdit }
}
