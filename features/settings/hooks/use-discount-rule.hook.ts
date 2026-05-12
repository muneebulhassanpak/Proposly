"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { upsertDiscountRuleAction } from "../actions/discount-rules.action"

export function useDiscountRule() {
  const [state, formAction, isPending] = useActionState(
    upsertDiscountRuleAction,
    null
  )

  useEffect(() => {
    if (state?.success) toast.success("Discount rule saved")
    if (state?.error) toast.error(state.error)
  }, [state])

  return { formAction, isPending }
}
