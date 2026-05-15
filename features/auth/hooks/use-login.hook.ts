"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { loginAction } from "../actions/auth.action"
import { loginSchema, type LoginFormData } from "../schemas/auth.schema"

export function useLogin() {
  const searchParams = useSearchParams()
  const deactivated = searchParams.get("reason") === "deactivated"

  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [honeypot, setHoneypot] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(data: LoginFormData) {
    if (honeypot) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set("email", data.email)
      formData.set("password", data.password)
      const result = await loginAction(null, formData)
      if (result?.error) toast.error(result.error)
    })
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
    showPassword,
    togglePassword: () => setShowPassword((v) => !v),
    honeypot,
    setHoneypot,
    deactivated,
  }
}
