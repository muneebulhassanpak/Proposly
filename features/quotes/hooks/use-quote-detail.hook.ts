"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ROUTES } from "@/lib/constants/routes.constants"
import {
  fetchQuoteDetailAction,
  createVersionAction,
  archiveVersionAction,
  extendExpiryAction,
} from "../actions/quote-detail.action"

export function useQuoteDetail(quoteId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const queryKey = ["quote-detail", quoteId]

  const {
    data: quote,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchQuoteDetailAction(quoteId),
  })

  // --- Active version tab ---
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null)
  const selectedVersionId =
    activeVersionId ?? quote?.versions[quote.versions.length - 1]?.id ?? null
  const selectedVersion =
    quote?.versions.find((v) => v.id === selectedVersionId) ?? null

  // --- Create new version ---
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const createVersionMutation = useMutation({
    mutationFn: () => createVersionAction({ quoteId }),
    onSuccess: (result) => {
      if (!result || !result.success) {
        toast.error(
          (result as { error: string })?.error ?? "Failed to create version"
        )
        return
      }
      toast.success("New version created")
      setCreateDialogOpen(false)
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ["dashboard-quotes"] })
      router.push(ROUTES.QUOTE(result.quoteId))
    },
  })

  // --- Archive version ---
  const archiveVersionMutation = useMutation({
    mutationFn: (versionId: string) =>
      archiveVersionAction({ versionId, quoteId }),
    onSuccess: (result) => {
      if (!result || !result.success) {
        toast.error(
          (result as { error: string })?.error ?? "Failed to archive version"
        )
        return
      }
      toast.success("Version archived")
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // --- Extend expiry ---
  const [extendDialogOpen, setExtendDialogOpen] = useState(false)
  const extendExpiryMutation = useMutation({
    mutationFn: (expiresAt: string) =>
      extendExpiryAction({ quoteId, expiresAt }),
    onSuccess: (result) => {
      if (!result || !result.success) {
        toast.error(
          (result as { error: string })?.error ?? "Failed to extend expiry"
        )
        return
      }
      toast.success("Expiry date updated")
      setExtendDialogOpen(false)
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    quote,
    isLoading,
    error,
    // Version tabs
    selectedVersionId,
    selectedVersion,
    setActiveVersionId,
    // Create version
    createDialogOpen,
    setCreateDialogOpen,
    onCreateVersion: () => createVersionMutation.mutate(),
    isCreatingVersion: createVersionMutation.isPending,
    // Archive version
    archiveVersion: (versionId: string) =>
      archiveVersionMutation.mutate(versionId),
    isArchiving: archiveVersionMutation.isPending,
    // Extend expiry
    extendDialogOpen,
    setExtendDialogOpen,
    onExtendExpiry: (date: string) => extendExpiryMutation.mutate(date),
    isExtendingExpiry: extendExpiryMutation.isPending,
  }
}
