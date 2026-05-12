"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateUserRole } from "../hooks/use-users.hook"
import type { UserProfile, UserRole } from "../settings.types"

interface EditRoleDialogProps {
  user: UserProfile
  onClose: () => void
}

export function EditRoleDialog({ user, onClose }: EditRoleDialogProps) {
  const [role, setRole] = useState<UserRole>(user.role)
  const updateRole = useUpdateUserRole()

  function handleSave() {
    updateRole.mutate(
      { userId: user.id, role },
      { onSuccess: (r) => r.success && onClose() }
    )
  }

  return (
    <DialogContent className="sm:max-w-xs">
      <DialogHeader>
        <DialogTitle>Change role</DialogTitle>
      </DialogHeader>
      <div className="py-2">
        <div className="space-y-1.5">
          <Label>Role for {user.full_name ?? user.email}</Label>
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rep">Rep</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter showCloseButton>
        <Button onClick={handleSave} loading={updateRole.isPending}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
