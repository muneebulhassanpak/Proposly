"use client"

import Image from "next/image"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "../actions/auth.action"

export function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <Image
            src="/proposly-mark.svg"
            alt="Proposly"
            width={36}
            height={36}
            priority
          />
          <span className="font-display text-3xl text-ink italic">
            Proposly
          </span>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-8">
          <h1 className="mb-6 text-lg font-semibold text-ink">Sign in</h1>

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@agency.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
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
