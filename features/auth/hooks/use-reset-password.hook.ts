"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { ROUTES } from "@/lib/constants/routes.constants"
import { resetPasswordAction } from "../actions/auth.action"
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/auth.schema"

export function useResetPassword() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(data: ResetPasswordFormData) {
    startTransition(async () => {
      const result = await resetPasswordAction(data)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Password updated")
      router.push(ROUTES.LOGIN)
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
  }
}
