"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getQuoteTemplatesAction } from "../actions/save-draft.action"
import type { LineItemRow } from "../quotes.types"

export function useLoadTemplateDialog(
  hasItems: boolean,
  onLoad: (items: LineItemRow[]) => void
) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["quote-templates"],
    queryFn: getQuoteTemplatesAction,
    enabled: open,
    staleTime: 60_000,
  })

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) {
      setSelected(null)
      setConfirmClear(false)
    }
  }

  function handleLoad() {
    if (hasItems && !confirmClear) {
      setConfirmClear(true)
      return
    }
    onLoad([])
    setOpen(false)
    setSelected(null)
    setConfirmClear(false)
  }

  return {
    open,
    handleOpenChange,
    selected,
    setSelected,
    confirmClear,
    templates,
    isLoading,
    handleLoad,
  }
}
