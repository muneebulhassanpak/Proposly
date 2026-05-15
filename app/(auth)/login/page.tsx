import { Suspense } from "react"

import { LoginPage } from "@/features/auth/pages/login.page"

export const metadata = { title: "Sign in — Proposly" }

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}
