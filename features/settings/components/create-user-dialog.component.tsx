"use client"

import { Controller } from "react-hook-form"
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
import { useCreateUserDialog } from "../hooks/use-create-user-dialog.hook"

export function CreateUserDialog() {
  const {
    open,
    handleOpenChange,
    register,
    handleSubmit,
    control,
    onSubmit,
    generatePassword,
    errors,
    isPending,
  } = useCreateUserDialog()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Button type="submit" loading={isPending}>
              Create user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
