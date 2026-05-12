"use client"

import { Badge } from "@/components/ui/badge"
import { ROLE_LABELS, USER_ROLES } from "@/lib/constants/roles.constants"
import type { UserRole } from "../settings.types"

export function RoleBadge({ role }: { role: UserRole }) {
  const variant =
    role === USER_ROLES.ADMIN
      ? "cobalt"
      : role === USER_ROLES.MANAGER
        ? "amber"
        : "slate"
  return <Badge variant={variant}>{ROLE_LABELS[role]}</Badge>
}
