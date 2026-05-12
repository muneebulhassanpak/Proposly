"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { getDashboardColumns } from "../components/dashboard-columns.component"
import type { DashboardQuote } from "../dashboard.types"

export function useDashboardTable(quotes: DashboardQuote[]) {
  const columns = useMemo(() => getDashboardColumns(), [])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: quotes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  return { table, columns }
}
