"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"

import { getManagerColumns } from "../components/manager-columns.component"
import type { ManagerQuote } from "../manager.types"

interface UseManagerTableParams {
  quotes: ManagerQuote[]
  pageCount: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  pageIndex: number
  pageSize: number
  onPageIndexChange: (index: number) => void
  onPageSizeChange: (size: number) => void
}

export function useManagerTable({
  quotes,
  pageCount,
  sorting,
  onSortingChange,
  pageIndex,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
}: UseManagerTableParams) {
  const columns = useMemo(() => getManagerColumns(), [])

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
