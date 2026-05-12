"use client"

import { Badge } from "@/components/ui/badge"
import { ROLE_LABELS } from "@/lib/constants/roles.constants"
import type { UserRole } from "../settings.types"

export function RoleBadge({ role }: { role: UserRole }) {
  const variant =
    role === "admin" ? "cobalt" : role === "manager" ? "amber" : "slate"
  return <Badge variant={variant}>{ROLE_LABELS[role]}</Badge>
}
