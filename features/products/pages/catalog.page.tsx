"use client"

import { flexRender } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductDialog } from "../components/product-dialog.component"
import { useCatalogTable } from "../hooks/use-catalog-table.hook"

export function CatalogPage() {
  const {
    table,
    columns,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    totalCount,
    isLoading,
    sheetOpen,
    setSheetOpen,
    editProduct,
    setEditProduct,
  } = useCatalogTable()

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

      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as "all" | "active" | "inactive")
          }
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
                  {totalCount === 0
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

      <ProductDialog
        key={editProduct?.id ?? "new"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editProduct}
      />
    </div>
  )
}
