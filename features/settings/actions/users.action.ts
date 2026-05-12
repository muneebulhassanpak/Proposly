"use server"

import { requireRole } from "@/lib/auth.utils"
import { createAdminClient } from "@/lib/supabase/admin.service"
import { createClient } from "@/lib/supabase/server.service"
import { editRoleSchema, inviteUserSchema } from "../schemas/user.schema"
import type { UserRole } from "../settings.types"

export type UserActionResult = { success: boolean; error?: string }

export async function inviteUserAction(
  email: string,
  role: "manager" | "rep"
): Promise<UserActionResult> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { success: false, error: "No company associated" }

  const parsed = inviteUserSchema.safeParse({ email, role })
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const admin = createAdminClient()

  const { data, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    parsed.data.email,
    { data: { role: parsed.data.role, company_id: profile.company_id } }
  )

  if (inviteError) return { success: false, error: inviteError.message }

  // Create profile row for the invited user
  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email: parsed.data.email,
    role: parsed.data.role,
    company_id: profile.company_id,
  })

  if (profileError) return { success: false, error: profileError.message }
  return { success: true }
}

export async function updateUserRoleAction(
  userId: string,
  role: UserRole
): Promise<UserActionResult> {
  const profile = await requireRole("admin")

  const parsed = editRoleSchema.safeParse({ userId, role })
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId)
    .eq("company_id", profile.company_id!)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function toggleUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<UserActionResult> {
  const profile = await requireRole("admin")

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId)
    .eq("company_id", profile.company_id!)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
