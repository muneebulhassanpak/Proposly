"use client"

import { useMemo, useState } from "react"
import { Pencil, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PriceHistoryDialog } from "../components/price-history-dialog.component"
import { ProductSheet } from "../components/product-sheet.component"
import { useProducts, useToggleProductActive } from "../hooks/use-products.hook"
import type { Product } from "../products.types"

type StatusFilter = "all" | "active" | "inactive"

export function CatalogPage() {
  const { data: products, isLoading } = useProducts()
  const toggleActive = useToggleProductActive()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    if (!products) return []
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && p.is_active) ||
        (statusFilter === "inactive" && !p.is_active)
      return matchSearch && matchStatus
    })
  }, [products, search, statusFilter])

  function openAdd() {
    setEditProduct(null)
    setSheetOpen(true)
  }

  function openEdit(product: Product) {
    setEditProduct(product)
    setSheetOpen(true)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Product Catalog</h1>
          <p className="mt-1 text-sm text-ink-mute">
            Manage your service catalog.
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus size={14} strokeWidth={1.5} />
          Add product
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-hairline bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Unit price</TableHead>
              <TableHead className="text-right">Cost price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && !filtered.length && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-sm text-ink-mute"
                >
                  {products?.length === 0
                    ? "No products yet. Add your first service."
                    : "No products match your filters."}
                </TableCell>
              </TableRow>
            )}

            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-ink">
                  {product.name}
                </TableCell>
                <TableCell className="text-ink-mute">
                  {product.category ?? "—"}
                </TableCell>
                <TableCell className="text-ink-mute capitalize">
                  {product.unit ?? "—"}
                </TableCell>
                <TableCell className="text-right font-mono text-ink tabular-nums">
                  {product.unit_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-ink-mute tabular-nums">
                  {product.cost_price?.toLocaleString() ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="sm"
                      checked={product.is_active ?? false}
                      onCheckedChange={(v) =>
                        toggleActive.mutate({
                          productId: product.id,
                          isActive: v,
                        })
                      }
                    />
                    <Badge variant={product.is_active ? "active" : "inactive"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <PriceHistoryDialog
                      productId={product.id}
                      productName={product.name}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil size={14} strokeWidth={1.5} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductSheet
        key={editProduct?.id ?? "new"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editProduct}
      />
    </div>
  )
}
