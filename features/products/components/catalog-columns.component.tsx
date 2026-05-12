"use client"

import { Pencil } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { SortIcon } from "@/components/sort-icon.component"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PriceHistoryDialog } from "./price-history-dialog.component"
import type { Product } from "../products.types"

interface CatalogColumnParams {
  onEdit: (product: Product) => void
  onToggleActive: (productId: string, isActive: boolean) => void
}

export function getCatalogColumns({
  onEdit,
  onToggleActive,
}: CatalogColumnParams): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-ink"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-ink">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-ink"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-ink-mute">{row.original.category ?? "—"}</span>
      ),
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => (
        <span className="text-ink-mute capitalize">
          {row.original.unit ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "unit_price",
      header: ({ column }) => (
        <button
          className="flex w-full items-center justify-end gap-1 hover:text-ink"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit price
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="block text-right font-mono text-ink tabular-nums">
          {row.original.unit_price.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "cost_price",
      header: () => <span className="block text-right">Cost price</span>,
      cell: ({ row }) => (
        <span className="block text-right font-mono text-ink-mute tabular-nums">
          {row.original.cost_price?.toLocaleString() ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Switch
          size="sm"
          checked={row.original.is_active ?? false}
          onCheckedChange={(v) => onToggleActive(row.original.id, v)}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <PriceHistoryDialog
            productId={row.original.id}
            productName={row.original.name}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(row.original)}
          >
            <Pencil size={14} strokeWidth={1.5} />
          </Button>
        </div>
      ),
    },
  ]
}
