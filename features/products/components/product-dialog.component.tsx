"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products.hook"
import type { ProductFormData } from "../schemas/product.schema"
import type { Product } from "../products.types"

const UNITS = ["hour", "page", "project", "item", "word", "custom"] as const

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  description: null,
  category: null,
  unit: "item",
  unit_price: 0,
  cost_price: null,
  is_active: true,
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
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
          unit: (product.unit ?? "item") as ProductFormData["unit"],
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
          { onSuccess: (r) => r.success && onOpenChange(false) }
        )
      : create.mutate(form, {
          onSuccess: (r) => r.success && onOpenChange(false),
        })
    void mutation
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>

        <form
          id="product-dialog-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-description">Description</Label>
            <Textarea
              id="p-description"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value || null)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-category">Category</Label>
              <Input
                id="p-category"
                value={form.category ?? ""}
                onChange={(e) => set("category", e.target.value || null)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select
                value={form.unit}
                onValueChange={(v) => set("unit", v as ProductFormData["unit"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-unit-price">Unit price</Label>
              <Input
                id="p-unit-price"
                type="number"
                min="0"
                step="0.01"
                value={form.unit_price}
                onChange={(e) =>
                  set("unit_price", parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-cost-price">Cost price</Label>
              <Input
                id="p-cost-price"
                type="number"
                min="0"
                step="0.01"
                value={form.cost_price ?? ""}
                onChange={(e) =>
                  set(
                    "cost_price",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <Switch
              id="p-active"
              checked={form.is_active}
              onCheckedChange={(v) => set("is_active", v)}
            />
            <Label htmlFor="p-active">Active</Label>
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="product-dialog-form" loading={isPending}>
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
