"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { updateCompanyAction } from "../actions/company.action"
import type { Company } from "../settings.types"

export function useCompanySettings(company: Company | null) {
  const [state, formAction, isPending] = useActionState(
    updateCompanyAction,
    null
  )
  const [logoPreview, setLogoPreview] = useState<string | null>(
    company?.logo_url ?? null
  )
  const [brandColor, setBrandColor] = useState(
    company?.brand_color ?? "#1E40D8"
  )
  const [currency, setCurrency] = useState(company?.default_currency ?? "USD")
  const currencyInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.success) toast.success("Settings saved")
    if (state?.error) toast.error(state.error)
  }, [state])

  // Keep hidden currency input in sync with Select
  useEffect(() => {
    if (currencyInputRef.current) currencyInputRef.current.value = currency
  }, [currency])

  function onLogoChange(file: File) {
    setLogoPreview(URL.createObjectURL(file))
  }

  return {
    formAction,
    isPending,
    logoPreview,
    onLogoChange,
    brandColor,
    setBrandColor,
    currency,
    setCurrency,
    currencyInputRef,
  }
}
