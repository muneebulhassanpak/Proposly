import { createAdminClient } from "@/lib/supabase/admin.service"
import { createClient } from "@/lib/supabase/server.service"
import type { CreateUserFormData } from "../schemas/user.schema"
import type { UserRole } from "../settings.types"

export async function upsertUserProfile(
  userId: string,
  data: {
    email: string
    full_name: string
    role: CreateUserFormData["role"]
    company_id: string
  }
): Promise<{ error: string | null }> {
  const admin = createAdminClient()
  const { error } = await admin.from("profiles").upsert({ id: userId, ...data })
  return { error: error?.message ?? null }
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
  companyId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .eq("company_id", companyId)
  return { error: error?.message ?? null }
}

export async function toggleUserActive(
  userId: string,
  isActive: boolean,
  companyId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId)
    .eq("company_id", companyId)
  return { error: error?.message ?? null }
}
