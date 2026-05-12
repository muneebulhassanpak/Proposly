"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { SortingState } from "@tanstack/react-table"

import { createClient } from "@/lib/supabase/browser.service"
import type { UserProfile } from "../settings.types"
import {
  createUserAction,
  toggleUserActiveAction,
  updateUserRoleAction,
} from "../actions/users.action"
import { getUsersClient } from "../services/users.service"
import type { UserRole } from "../settings.types"

export function useUserFilters() {
  const { data: users, isLoading } = useUsers()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [editUser, setEditUser] = useState<UserProfile | null>(null)

  const { data: currentUserId } = useQuery({
    queryKey: ["auth-user-id"],
    queryFn: async () => {
      const { data } = await createClient().auth.getUser()
      return data.user?.id ?? null
    },
  })

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

  return {
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
  }
}

const USERS_KEY = ["users"] as const

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: getUsersClient,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
      role,
    }: {
      name: string
      email: string
      password: string
      role: "manager" | "rep"
    }) => createUserAction(name, email, password, role),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? "Failed to create user")
        return
      }
      toast.success("User created")
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
    onError: () => toast.error("Failed to create user"),
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRoleAction(userId, role),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? "Failed to update role")
        return
      }
      toast.success("Role updated")
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
    onError: () => toast.error("Failed to update role"),
  })
}

export function useToggleUserActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleUserActiveAction(userId, isActive),
    onSuccess: (result, variables) => {
      if (!result.success) {
        toast.error(result.error ?? "Failed to update status")
        return
      }
      toast.success(variables.isActive ? "User activated" : "User deactivated")
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
    onError: () => toast.error("Failed to update status"),
  })
}
