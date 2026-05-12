"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import type { DashboardQuote } from "../dashboard.types"
import {
  getDashboardQuotes,
  getDashboardSummary,
} from "../services/dashboard.service"

const EMPTY_QUOTES: DashboardQuote[] = []

export function useDashboardQuotes(userId: string) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary", userId],
    queryFn: () => getDashboardSummary(userId),
  })

  const quotesQuery = useQuery({
    queryKey: ["dashboard-quotes", userId],
    queryFn: () => getDashboardQuotes(userId),
  })

  const quotes = quotesQuery.data ?? EMPTY_QUOTES

  const filtered = useMemo(
    () =>
      quotes.filter((q) => {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          !search ||
          q.title.toLowerCase().includes(searchLower) ||
          (q.clientName ?? "").toLowerCase().includes(searchLower) ||
          (q.clientCompanyName ?? "").toLowerCase().includes(searchLower)

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "pending_approval"
            ? q.hasPendingApproval
            : q.status === statusFilter)

        return matchesSearch && matchesStatus
      }),
    [quotes, search, statusFilter]
  )

  return {
    summary: summaryQuery.data,
    isSummaryLoading: summaryQuery.isLoading,
    quotes: filtered,
    isLoading: quotesQuery.isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  }
}
