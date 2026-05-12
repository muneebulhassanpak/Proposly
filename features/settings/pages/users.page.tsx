"use client"

import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"

import { createClient } from "@/lib/supabase/browser.service"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  MoreHorizontal,
  Plus,
  Shuffle,
  UserCheck,
  UserX,
} from "lucide-react"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useCreateUser,
  useToggleUserActive,
  useUpdateUserRole,
  useUsers,
} from "../hooks/use-users.hook"
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/user.schema"
import type { UserProfile, UserRole } from "../settings.types"

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  rep: "Rep",
}

function RoleBadge({ role }: { role: UserRole }) {
  const variant =
    role === "admin" ? "cobalt" : role === "manager" ? "amber" : "slate"
  return <Badge variant={variant}>{ROLE_LABELS[role]}</Badge>
}

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

function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const create = useCreateUser()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "", role: "rep" },
    mode: "onChange",
  })

  function onSubmit(data: CreateUserFormData) {
    create.mutate(data, {
      onSuccess: (result) => {
        if (result.success) {
          setOpen(false)
          reset()
        }
      },
    })
  }

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    const arr = new Uint8Array(16)
    crypto.getRandomValues(arr)
    setValue(
      "password",
      Array.from(arr)
        .map((b) => chars[b % chars.length])
        .join(""),
      { shouldValidate: true }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus size={14} strokeWidth={1.5} />
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Full name</Label>
              <Input
                id="create-name"
                placeholder="Jane Smith"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-crimson">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email address</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="jane@agency.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-crimson">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-password">Password</Label>
              <div className="relative">
                <Input
                  id="create-password"
                  type="text"
                  placeholder="Min. 8 characters"
                  className="pr-9 font-mono text-xs"
                  {...register("password")}
                />
                <button
                  type="button"
                  title="Generate strong password"
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-ink-mute transition-colors hover:text-primary"
                  onClick={generatePassword}
                >
                  <Shuffle size={14} strokeWidth={1.5} />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-crimson">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rep">Rep</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button type="submit" loading={create.isPending}>
              Create user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditRoleDialog({
  user,
  onClose,
}: {
  user: UserProfile
  onClose: () => void
}) {
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

export function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const toggleActive = useToggleUserActive()
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const { data: currentUserId } = useQuery({
    queryKey: ["auth-user-id"],
    queryFn: async () => {
      const { data } = await createClient().auth.getUser()
      return data.user?.id ?? null
    },
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")

  const filtered = useMemo(() => {
    if (!users) return []
    return users.filter((u) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q)
      const matchRole = roleFilter === "all" || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  const columns = useMemo<ColumnDef<UserProfile>[]>(
    () => [
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
              open={editUser?.id === user.id}
              onOpenChange={(o) => !o && setEditUser(null)}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal size={14} strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditUser(user)}>
                    Change role
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      toggleActive.mutate({
                        userId: user.id,
                        isActive: !user.is_active,
                      })
                    }
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
              {editUser?.id === user.id && (
                <EditRoleDialog
                  user={editUser}
                  onClose={() => setEditUser(null)}
                />
              )}
            </Dialog>
          )
        },
      },
    ],
    [toggleActive, editUser, currentUserId]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">User Management</h1>
          <p className="mt-1 text-sm text-ink-mute">
            Manage team members and their roles.
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="rep">Rep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-hairline bg-surface">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "actions" ? "w-10" : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-ink-mute"
                >
                  No users yet.
                </TableCell>
              </TableRow>
            )}

            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
