import type { ReactNode } from "react"

import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"

export default async function QuotesLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireRole(USER_ROLES.REP)
  return <>{children}</>
}
