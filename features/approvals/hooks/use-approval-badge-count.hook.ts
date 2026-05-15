"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchPendingApprovalCountAction } from "../actions/approval.action"

export function useApprovalBadgeCount() {
  const { data } = useQuery({
    queryKey: ["pending-approval-count"],
    queryFn: () => fetchPendingApprovalCountAction(),
    refetchInterval: 60_000,
  })

  return data ?? 0
}
