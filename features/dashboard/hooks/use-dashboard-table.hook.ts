"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"

import { getDashboardColumns } from "../components/dashboard-columns.component"
import type { DashboardQuote } from "../dashboard.types"

interface UseDashboardTableParams {
  quotes: DashboardQuote[]
  pageCount: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  pageIndex: number
  pageSize: number
  onPageIndexChange: (index: number) => void
  onPageSizeChange: (size: number) => void
}

export function useDashboardTable({
  quotes,
  pageCount,
  sorting,
  onSortingChange,
  pageIndex,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
}: UseDashboardTableParams) {
  const columns = useMemo(() => getDashboardColumns(), [])

  const pagination: PaginationState = { pageIndex, pageSize }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: quotes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount,
    state: { sorting, pagination },
    onSortingChange,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater
      if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize)
      if (next.pageIndex !== pageIndex) onPageIndexChange(next.pageIndex)
    },
  })

  return { table, columns }
}
