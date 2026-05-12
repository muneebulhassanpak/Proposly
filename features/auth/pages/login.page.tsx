"use client"

import { useActionState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "../actions/auth.action"

export function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-3xl text-ink italic">
            Proposly
          </span>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-8">
          <h1 className="mb-6 text-lg font-semibold text-ink">Sign in</h1>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <p className="rounded-sm bg-crimson-soft px-3 py-2 text-sm text-crimson">
                {state.error}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@agency.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-ink-mute transition-colors hover:text-ink"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
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
