"use client"

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
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { useEditRoleDialog } from "../hooks/use-edit-role-dialog.hook"
import type { UserProfile, UserRole } from "../settings.types"

interface EditRoleDialogProps {
  user: UserProfile
  onClose: () => void
}

export function EditRoleDialog({ user, onClose }: EditRoleDialogProps) {
  const { role, setRole, handleSave, isPending } = useEditRoleDialog(
    user,
    onClose
  )

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
              <SelectItem value={USER_ROLES.REP}>Rep</SelectItem>
              <SelectItem value={USER_ROLES.MANAGER}>Manager</SelectItem>
              <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter showCloseButton>
        <Button onClick={handleSave} loading={isPending}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
