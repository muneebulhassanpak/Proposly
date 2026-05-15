"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { SortingState } from "@tanstack/react-table"

import {
  getManagerQuotes,
  getManagerSummary,
} from "../services/manager-dashboard.service"

const DEFAULT_PAGE_SIZE = 10

export function useManagerQuotes(companyId: string) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const sortBy = sorting[0]?.id ?? "updatedAt"
  const sortDesc = sorting[0]?.desc ?? true

  const summaryQuery = useQuery({
    queryKey: ["manager-summary", companyId],
    queryFn: () => getManagerSummary(companyId),
  })

  const quotesQuery = useQuery({
    queryKey: [
      "manager-quotes",
      companyId,
      search,
      statusFilter,
      sortBy,
      sortDesc,
      pageIndex,
      pageSize,
    ],
    queryFn: () =>
      getManagerQuotes({
        companyId,
        search,
        status: statusFilter,
        sortBy,
        sortDesc,
        page: pageIndex,
        pageSize,
      }),
  })

  const quotes = quotesQuery.data?.quotes ?? []
  const totalCount = quotesQuery.data?.totalCount ?? 0
  const pageCount = Math.ceil(totalCount / pageSize)

  function refetch() {
    summaryQuery.refetch()
    quotesQuery.refetch()
  }

  return {
    summary: summaryQuery.data,
    isSummaryLoading: summaryQuery.isLoading,
    quotes,
    totalCount,
    pageCount,
    isLoading: quotesQuery.isLoading,
    isRefetching: quotesQuery.isRefetching,
    refetch,
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
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size)
      setPageIndex(0)
    },
  }
}
