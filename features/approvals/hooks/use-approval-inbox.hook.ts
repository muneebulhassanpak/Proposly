"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { fetchPendingApprovalsAction } from "../actions/approval.action"

const DEFAULT_PAGE_SIZE = 10

export function useApprovalInbox() {
  const [search, setSearch] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const { data, isLoading } = useQuery({
    queryKey: ["pending-approvals", search, pageIndex, pageSize],
    queryFn: () =>
      fetchPendingApprovalsAction({ search, page: pageIndex, pageSize }),
    staleTime: 0,
    refetchInterval: 60_000,
  })

  const approvals = data?.approvals ?? []
  const totalCount = data?.totalCount ?? 0
  const pageCount = Math.ceil(totalCount / pageSize)

  return {
    approvals,
    totalCount,
    pageCount,
    isLoading,
    search,
    setSearch: (value: string) => {
      setSearch(value)
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
