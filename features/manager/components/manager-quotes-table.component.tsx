"use client"

import { flexRender } from "@tanstack/react-table"
import type { Table } from "@tanstack/react-table"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ManagerQuote } from "../manager.types"

interface ManagerQuotesTableProps {
  table: Table<ManagerQuote>
  columns: { id?: string; accessorKey?: string }[]
  isLoading: boolean
}

export function ManagerQuotesTable({
  table,
  columns,
  isLoading,
}: ManagerQuotesTableProps) {
  return (
    <div className="rounded-[10px] border border-hairline bg-surface">
      <UiTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns.length }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-sm text-ink-mute"
              >
                No quotes found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </UiTable>
      <DataTablePagination table={table} />
    </div>
  )
}
