"use client"

import { useState } from "react"

import { useUpdateUserRole } from "./use-users.hook"
import type { UserProfile, UserRole } from "../settings.types"

export function useEditRoleDialog(user: UserProfile, onClose: () => void) {
  const [role, setRole] = useState<UserRole>(user.role)
  const updateRole = useUpdateUserRole()

  function handleSave() {
    updateRole.mutate(
      { userId: user.id, role },
      { onSuccess: (r) => r.success && onClose() }
    )
  }

  return { role, setRole, handleSave, isPending: updateRole.isPending }
}
