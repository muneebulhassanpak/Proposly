"use client"

import { useTransition } from "react"

import { logoutAction } from "@/lib/actions/auth.action"

export function useLogout() {
  const [isLoggingOut, startTransition] = useTransition()

  function logout() {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return { logout, isLoggingOut }
}
