"use client"

import { useRouter } from "next/navigation"
import { flexRender } from "@tanstack/react-table"
import type { Table } from "@tanstack/react-table"
import { ChevronRight, Inbox } from "lucide-react"

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
import { ROUTES } from "@/lib/constants/routes.constants"
import type { ApprovalListItem } from "../approvals.types"

interface ApprovalInboxTableProps {
  table: Table<ApprovalListItem>
  columns: { id?: string; accessorKey?: string }[]
  isLoading: boolean
  isEmpty: boolean
}

export function ApprovalInboxTable({
  table,
  columns,
  isLoading,
  isEmpty,
}: ApprovalInboxTableProps) {
  const router = useRouter()

  if (!isLoading && isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-hairline bg-surface py-16">
        <Inbox size={24} strokeWidth={1.5} className="mb-3 text-ink-mute" />
        <p className="text-sm text-ink-mute">No pending approvals.</p>
      </div>
    )
  }

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
              <TableHead className="w-8" />
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns.length + 1 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-10 text-center text-sm text-ink-mute"
              >
                No approvals match your search.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="group cursor-pointer"
                onClick={() =>
                  router.push(ROUTES.MANAGER_APPROVAL_DETAIL(row.original.id))
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-ink-mute opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </UiTable>
      <DataTablePagination table={table} />
    </div>
  )
}
