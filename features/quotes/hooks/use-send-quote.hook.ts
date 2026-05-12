"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { ROUTES } from "@/lib/constants/routes.constants"
import { sendQuoteAction } from "../actions/send-quote.action"

export function useSendQuote(quoteId: string) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: () => sendQuoteAction({ quoteId }),
    onSuccess: (result) => {
      if (result.success) {
        setDialogOpen(false)
        toast.success("Proposal sent.")
        router.push(ROUTES.QUOTE(quoteId))
      } else {
        toast.error(result.error)
      }
    },
  })

  return {
    dialogOpen,
    openDialog: () => setDialogOpen(true),
    closeDialog: () => setDialogOpen(false),
    onConfirm: () => mutation.mutate(),
    isSending: mutation.isPending,
  }
}
