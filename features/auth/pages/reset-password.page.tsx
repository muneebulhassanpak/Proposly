"use client"

import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResetPassword } from "../hooks/use-reset-password.hook"

export function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
    showPassword,
    togglePassword,
  } = useResetPassword()

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-hairline bg-surface p-8">
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/proposly-mark.svg"
                alt="Proposly"
                width={32}
                height={32}
                priority
              />
              <span className="font-display text-2xl text-ink italic">
                Proposly
              </span>
            </div>
            <p className="text-sm text-ink-mute">Choose a new password</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-mute transition-colors hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-crimson">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-crimson">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" loading={isPending} className="w-full">
              Update password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
