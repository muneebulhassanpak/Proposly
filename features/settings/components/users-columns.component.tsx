"use client"

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  MoreHorizontal,
  UserCheck,
  UserX,
} from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROLE_LABELS } from "@/lib/constants/roles.constants"
import { EditRoleDialog } from "./edit-role-dialog.component"
import type { UserProfile, UserRole } from "../settings.types"

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")
    return <ArrowUp size={12} strokeWidth={1.5} className="shrink-0" />
  if (direction === "desc")
    return <ArrowDown size={12} strokeWidth={1.5} className="shrink-0" />
  return (
    <ChevronsUpDown
      size={12}
      strokeWidth={1.5}
      className="shrink-0 text-ink-faint"
    />
  )
}

function RoleBadge({ role }: { role: UserRole }) {
  const variant =
    role === "admin" ? "cobalt" : role === "manager" ? "amber" : "slate"
  return <Badge variant={variant}>{ROLE_LABELS[role]}</Badge>
}

interface UsersColumnParams {
  currentUserId: string | null | undefined
  editUserId: string | null
  onEditUser: (user: UserProfile) => void
  onCloseEdit: () => void
  onToggleActive: (userId: string, isActive: boolean) => void
}

export function getUsersColumns({
  currentUserId,
  editUserId,
  onEditUser,
  onCloseEdit,
  onToggleActive,
}: UsersColumnParams): ColumnDef<UserProfile>[] {
  return [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-ink">
          {row.original.full_name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-ink-mute">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "active" : "inactive"}>
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-ink"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <SortIcon direction={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-ink-mute">
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        if (user.id === currentUserId) return null
        return (
          <Dialog
            open={editUserId === user.id}
            onOpenChange={(o) => !o && onCloseEdit()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal size={14} strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditUser(user)}>
                  Change role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onToggleActive(user.id, !user.is_active)}
                  className={user.is_active ? "text-crimson" : undefined}
                >
                  {user.is_active ? (
                    <>
                      <UserX size={14} strokeWidth={1.5} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck size={14} strokeWidth={1.5} />
                      Reactivate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {editUserId === user.id && (
              <EditRoleDialog user={user} onClose={onCloseEdit} />
            )}
          </Dialog>
        )
      },
    },
  ]
}
