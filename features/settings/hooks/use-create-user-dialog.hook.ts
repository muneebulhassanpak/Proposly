"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { USER_ROLES } from "@/lib/constants/roles.constants"
import { useCreateUser } from "./use-users.hook"
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/user.schema"

export function useCreateUserDialog() {
  const [open, setOpen] = useState(false)
  const create = useCreateUser()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: USER_ROLES.REP },
    mode: "onChange",
  })

  function onSubmit(data: CreateUserFormData) {
    create.mutate(data, {
      onSuccess: (result) => {
        if (result.success) {
          setOpen(false)
          reset()
        }
      },
    })
  }

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    const arr = new Uint8Array(16)
    crypto.getRandomValues(arr)
    setValue(
      "password",
      Array.from(arr)
        .map((b) => chars[b % chars.length])
        .join(""),
      { shouldValidate: true }
    )
  }

  function handleOpenChange(o: boolean) {
    setOpen(o)
    if (!o) reset()
  }

  return {
    open,
    handleOpenChange,
    register,
    handleSubmit,
    control,
    onSubmit,
    generatePassword,
    errors,
    isPending: create.isPending,
  }
}
