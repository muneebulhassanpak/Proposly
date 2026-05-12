"use client"

import { useActionState } from "react"

import { forgotPasswordAction } from "../actions/auth.action"

export function useForgotPassword() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null
  )

  return { state, formAction, isPending }
}
