"use client"

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
import {
  PRODUCT_UNITS,
  type ProductUnit,
} from "@/lib/constants/product.constants"
import { useProductDialog } from "../hooks/use-product-dialog.hook"
import type { Product } from "../products.types"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
  const { form, set, handleSubmit, isPending, isEdit } = useProductDialog(
    product,
    () => onOpenChange(false)
  )

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
                onValueChange={(v) => set("unit", v as ProductUnit)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map((u) => (
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
