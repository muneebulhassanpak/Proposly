"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createUserAction,
  toggleUserActiveAction,
  updateUserRoleAction,
} from "../actions/users.action"
import { getUsersClient } from "../services/users.service"
import type { UserRole } from "../settings.types"

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
