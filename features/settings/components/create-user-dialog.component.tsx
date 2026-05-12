"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Shuffle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateUser } from "../hooks/use-users.hook"
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/user.schema"

export function CreateUserDialog() {
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
    defaultValues: { name: "", email: "", password: "", role: "rep" },
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

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus size={14} strokeWidth={1.5} />
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Full name</Label>
              <Input
                id="create-name"
                placeholder="Jane Smith"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-crimson">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email address</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="jane@agency.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-crimson">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-password">Password</Label>
              <div className="relative">
                <Input
                  id="create-password"
                  type="text"
                  placeholder="Min. 8 characters"
                  className="pr-9 font-mono text-xs"
                  {...register("password")}
                />
                <button
                  type="button"
                  title="Generate strong password"
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-ink-mute transition-colors hover:text-primary"
                  onClick={generatePassword}
                >
                  <Shuffle size={14} strokeWidth={1.5} />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-crimson">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rep">Rep</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button type="submit" loading={create.isPending}>
              Create user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
