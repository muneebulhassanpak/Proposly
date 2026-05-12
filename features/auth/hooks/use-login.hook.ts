"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { loginAction } from "../actions/auth.action"

export function useLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return { formAction, isPending, email, setEmail }
}
