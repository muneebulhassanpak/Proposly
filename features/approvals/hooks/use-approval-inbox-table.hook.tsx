"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type ColumnDef,
} from "@tanstack/react-table"

import type { ApprovalListItem } from "../approvals.types"
import { formatMoney } from "@/lib/utils/format.utils"

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

function getColumns(): ColumnDef<ApprovalListItem>[] {
  return [
    {
      accessorKey: "quoteTitle",
      header: "Quote",
      cell: ({ row }) => (
        <span className="font-medium text-ink group-hover:underline">
          {row.original.quoteTitle}
        </span>
      ),
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => (
        <span className="text-sm text-ink-soft">
          {row.original.clientCompanyName ??
            row.original.clientName ??
            "No client"}
        </span>
      ),
    },
    {
      accessorKey: "repName",
      header: "Rep",
      cell: ({ row }) => (
        <span className="text-sm text-ink-soft">{row.original.repName}</span>
      ),
    },
    {
      accessorKey: "discountPercent",
      header: () => <span className="block text-right">Discount</span>,
      cell: ({ row }) => (
        <span className="block text-right font-mono text-sm text-amber tabular-nums">
          {row.original.discountPercent.toFixed(1)}%
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: () => <span className="block text-right">Total</span>,
      cell: ({ row }) => (
        <span className="block text-right font-mono text-sm tabular-nums">
          {formatMoney(row.original.total, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "requestedAt",
      header: () => <span className="block text-right">Requested</span>,
      cell: ({ row }) => (
        <span className="block text-right text-sm text-ink-mute">
          {formatRelativeTime(row.original.requestedAt)}
        </span>
      ),
    },
  ]
}

interface UseApprovalInboxTableParams {
  approvals: ApprovalListItem[]
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageIndexChange: (index: number) => void
  onPageSizeChange: (size: number) => void
}

export function useApprovalInboxTable({
  approvals,
  pageCount,
  pageIndex,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
}: UseApprovalInboxTableParams) {
  const columns = useMemo(() => getColumns(), [])

  const pagination: PaginationState = { pageIndex, pageSize }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: approvals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: { pagination },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater
      if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize)
      if (next.pageIndex !== pageIndex) onPageIndexChange(next.pageIndex)
    },
  })

  return { table, columns }
}
