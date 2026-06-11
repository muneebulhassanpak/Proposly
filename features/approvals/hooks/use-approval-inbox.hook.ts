"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchPendingApprovalsAction } from "../actions/approval.action"

export function useApprovalInbox() {
  const { data, isLoading } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: () => fetchPendingApprovalsAction(),
    staleTime: 0,
    refetchInterval: 60_000,
  })

  return {
    approvals: data ?? [],
    isLoading,
  }
}
