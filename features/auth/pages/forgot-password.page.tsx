"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/constants/routes.constants"
import { useForgotPassword } from "../hooks/use-forgot-password.hook"

export function ForgotPasswordPage() {
  const { state, formAction, isPending } = useForgotPassword()

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
            <p className="text-sm text-ink-mute">Reset your password</p>
          </div>

          {state?.success ? (
            <div className="rounded-md border border-hairline p-4 text-center text-sm text-ink">
              Check your email for a reset link.
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="rounded-md border border-crimson/20 bg-crimson/5 px-3 py-2 text-sm text-crimson">
                  {state.error}
                </div>
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
          <Link
            href={ROUTES.LOGIN}
            className="transition-colors hover:text-ink"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
