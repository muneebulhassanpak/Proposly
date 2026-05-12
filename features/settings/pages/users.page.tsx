"use client"

import { useMemo } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Input } from "@/components/ui/input"
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
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { CreateUserDialog } from "../components/create-user-dialog.component"
import { getUsersColumns } from "../components/users-columns.component"
import { useToggleUserActive, useUserFilters } from "../hooks/use-users.hook"
import type { UserRole } from "../settings.types"

export function UsersPage() {
  const toggleActive = useToggleUserActive()
  const {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sorting,
    setSorting,
    editUser,
    setEditUser,
    currentUserId,
    filtered,
    isLoading,
  } = useUserFilters()

  const columns = useMemo(
    () =>
      getUsersColumns({
        currentUserId,
        editUserId: editUser?.id ?? null,
        onEditUser: setEditUser,
        onCloseEdit: () => setEditUser(null),
        onToggleActive: (userId, isActive) =>
          toggleActive.mutate({ userId, isActive }),
      }),
    [currentUserId, editUser, setEditUser, toggleActive]
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
            <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
            <SelectItem value={USER_ROLES.MANAGER}>Manager</SelectItem>
            <SelectItem value={USER_ROLES.REP}>Rep</SelectItem>
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
