"use client"

import { useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, Pencil, Plus } from "lucide-react"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
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

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")
    return <ArrowUp size={12} strokeWidth={1.5} className="shrink-0" />
  if (direction === "desc")
    return <ArrowDown size={12} strokeWidth={1.5} className="shrink-0" />
  return (
    <ChevronsUpDown
      size={12}
      strokeWidth={1.5}
      className="shrink-0 text-ink-faint"
    />
  )
}

export function CatalogPage() {
  const { data: products, isLoading } = useProducts()
  const toggleActive = useToggleProductActive()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sorting, setSorting] = useState<SortingState>([])
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

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
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
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center gap-2">
              <Switch
                size="sm"
                checked={product.is_active ?? false}
                onCheckedChange={(v) =>
                  toggleActive.mutate({ productId: product.id, isActive: v })
                }
              />
              <Badge variant={product.is_active ? "active" : "inactive"}>
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              <PriceHistoryDialog
                productId={product.id}
                productName={product.name}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setEditProduct(product)
                  setSheetOpen(true)
                }}
              >
                <Pencil size={14} strokeWidth={1.5} />
              </Button>
            </div>
          )
        },
      },
    ],
    [toggleActive]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Product Catalog</h1>
          <p className="mt-1 text-sm text-ink-mute">
            Manage your service catalog.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditProduct(null)
            setSheetOpen(true)
          }}
        >
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "actions" ? "w-24" : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
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

            {!isLoading && table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-ink-mute"
                >
                  {products?.length === 0
                    ? "No products yet. Add your first service."
                    : "No products match your filters."}
                </TableCell>
              </TableRow>
            )}

            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DataTablePagination table={table} />
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
