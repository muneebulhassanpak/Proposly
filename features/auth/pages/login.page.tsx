"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/constants/routes.constants"
import { useLogin } from "../hooks/use-login.hook"

export function LoginPage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isPending,
    showPassword,
    togglePassword,
    honeypot,
    setHoneypot,
    deactivated,
  } = useLogin()

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
            <p className="text-sm text-ink-mute">Welcome back</p>
          </div>

          {deactivated && (
            <div className="mb-4 rounded-md border border-crimson/20 bg-crimson/5 px-3 py-2 text-sm text-crimson">
              Your account has been deactivated. Contact your administrator.
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* Honeypot — hidden from real users, bots auto-fill it */}
            <input
              type="text"
              name="company_url"
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
              className="absolute h-0 w-0 overflow-hidden opacity-0"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@agency.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-crimson">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <div className="-mt-2 text-right">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-ink-mute transition-colors hover:text-ink"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={isPending} className="w-full">
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-ink-mute">
          For access, contact your administrator.
        </p>
      </div>
    </div>
  )
}
