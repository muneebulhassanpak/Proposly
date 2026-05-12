"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { getUsersColumns } from "../components/users-columns.component"
import { useToggleUserActive, useUserFilters } from "./use-users.hook"

export function useUsersTable() {
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

  return {
    table,
    columns,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    isLoading,
  }
}
