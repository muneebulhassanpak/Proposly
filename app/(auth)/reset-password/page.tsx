import { Suspense } from "react"

import { ResetPasswordPage } from "@/features/auth/pages/reset-password.page"

export const metadata = { title: "New password — Proposly" }

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  )
}
