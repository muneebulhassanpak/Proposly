import { createAdminClient } from "@/lib/supabase/admin.service"
import { createClient as createBrowserClient } from "@/lib/supabase/browser.service"
import { createClient as createServerClient } from "@/lib/supabase/server.service"
import type { CreateUserFormData } from "../schemas/user.schema"
import type { UserProfile, UserRole } from "../settings.types"

export async function getUsersClient(): Promise<UserProfile[]> {
  const supabase = createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single()

  if (!profile?.company_id) return []

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: true })

  return data ?? []
}

// --- Server-side mutations (called from server actions only) ---

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
  const supabase = await createServerClient()
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
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId)
    .eq("company_id", companyId)
  return { error: error?.message ?? null }
}
