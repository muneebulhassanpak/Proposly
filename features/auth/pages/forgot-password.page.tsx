"use client"

import { useActionState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordAction } from "../actions/auth.action"

export function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-3xl text-ink italic">
            Proposly
          </span>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-8">
          <h1 className="mb-1 text-lg font-semibold text-ink">
            Reset password
          </h1>
          <p className="mb-6 text-sm text-ink-mute">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {state?.success ? (
            <div className="rounded-sm border border-hairline p-4 text-sm text-ink">
              Check your email for a reset link.
            </div>
          ) : (
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

              <Button type="submit" loading={isPending} className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-ink-mute">
          <Link href="/login" className="transition-colors hover:text-ink">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
