"use server"

import { requireRole } from "@/lib/auth.utils"
import { createAdminClient } from "@/lib/supabase/admin.service"
import { createUserSchema, editRoleSchema } from "../schemas/user.schema"
import type { UserRole } from "../settings.types"
import {
  toggleUserActive,
  updateUserRole,
  upsertUserProfile,
} from "../services/users.service"

export type UserActionResult = { success: boolean; error?: string }

export async function createUserAction(
  name: string,
  email: string,
  password: string,
  role: "manager" | "rep"
): Promise<UserActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const parsed = createUserSchema.safeParse({ name, email, password, role })
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const admin = createAdminClient()

  const { data, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { role: parsed.data.role, company_id: profile.company_id },
  })

  if (createError) return { success: false, error: createError.message }

  const { error } = await upsertUserProfile(data.user.id, {
    email: parsed.data.email,
    full_name: parsed.data.name,
    role: parsed.data.role,
    company_id: profile.company_id,
  })

  if (error) return { success: false, error }
  return { success: true }
}

export async function updateUserRoleAction(
  userId: string,
  role: UserRole
): Promise<UserActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const parsed = editRoleSchema.safeParse({ userId, role })
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const { error } = await updateUserRole(
    parsed.data.userId,
    parsed.data.role,
    profile.company_id
  )

  if (error) return { success: false, error }
  return { success: true }
}

export async function toggleUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<UserActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const { error } = await toggleUserActive(userId, isActive, profile.company_id)
  if (error) return { success: false, error }
  return { success: true }
}
