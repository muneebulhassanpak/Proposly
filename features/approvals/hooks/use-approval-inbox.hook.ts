"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchPendingApprovalsAction } from "../actions/approval.action"

export function useApprovalInbox() {
  const { data, isLoading } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: () => fetchPendingApprovalsAction(),
  })

  return {
    approvals: data ?? [],
    isLoading,
  }
}
