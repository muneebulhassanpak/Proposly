"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { SortingState } from "@tanstack/react-table"

import {
  getDashboardQuotes,
  getDashboardSummary,
} from "../services/dashboard.service"

const PAGE_SIZE = 20

export function useDashboardQuotes(userId: string) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ])
  const [pageIndex, setPageIndex] = useState(0)

  const sortBy = sorting[0]?.id ?? "updatedAt"
  const sortDesc = sorting[0]?.desc ?? true

  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary", userId],
    queryFn: () => getDashboardSummary(userId),
  })

  const quotesQuery = useQuery({
    queryKey: [
      "dashboard-quotes",
      userId,
      search,
      statusFilter,
      sortBy,
      sortDesc,
      pageIndex,
    ],
    queryFn: () =>
      getDashboardQuotes({
        userId,
        search,
        status: statusFilter,
        sortBy,
        sortDesc,
        page: pageIndex,
        pageSize: PAGE_SIZE,
      }),
  })

  const quotes = quotesQuery.data?.quotes ?? []
  const totalCount = quotesQuery.data?.totalCount ?? 0
  const pageCount = Math.ceil(totalCount / PAGE_SIZE)

  return {
    summary: summaryQuery.data,
    isSummaryLoading: summaryQuery.isLoading,
    quotes,
    totalCount,
    pageCount,
    isLoading: quotesQuery.isLoading,
    search,
    setSearch: (value: string) => {
      setSearch(value)
      setPageIndex(0)
    },
    statusFilter,
    setStatusFilter: (value: string) => {
      setStatusFilter(value)
      setPageIndex(0)
    },
    sorting,
    setSorting: (
      updater: SortingState | ((old: SortingState) => SortingState)
    ) => {
      setSorting(updater)
      setPageIndex(0)
    },
    pageIndex,
    setPageIndex,
    pageSize: PAGE_SIZE,
  }
}
