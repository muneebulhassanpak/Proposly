"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ROUTES } from "@/lib/constants/routes.constants"
import {
  fetchApprovalDetailAction,
  approveQuoteAction,
  rejectQuoteAction,
} from "../actions/approval.action"

export function useApprovalDetail(approvalId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["approval-detail", approvalId],
    queryFn: () => fetchApprovalDetailAction(approvalId),
  })

  const approveMutation = useMutation({
    mutationFn: () => approveQuoteAction({ approvalId }),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
        queryClient.invalidateQueries({ queryKey: ["pending-approval-count"] })
        toast.success("Quote approved.")
        router.push(ROUTES.MANAGER_APPROVALS)
      } else {
        toast.error(result.error)
      }
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (note: string) => rejectQuoteAction({ approvalId, note }),
    onSuccess: (result) => {
      if (result.success) {
        setRejectDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
        queryClient.invalidateQueries({ queryKey: ["pending-approval-count"] })
        toast.success("Quote rejected.")
        router.push(ROUTES.MANAGER_APPROVALS)
      } else {
        toast.error(result.error)
      }
    },
  })

  return {
    approval: data ?? null,
    isLoading,
    approve: () => approveMutation.mutate(),
    isApproving: approveMutation.isPending,
    rejectDialogOpen,
    setRejectDialogOpen,
    reject: (note: string) => rejectMutation.mutate(note),
    isRejecting: rejectMutation.isPending,
  }
}
