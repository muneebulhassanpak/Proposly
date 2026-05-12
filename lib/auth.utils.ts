import { redirect } from "next/navigation"

import { createClient } from "./supabase/server.service"
import { ROUTES } from "./constants/routes.constants"
import type { Database } from "./supabase/database.types"

export type UserRole = Database["public"]["Enums"]["user_role"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
}

export async function requireAuth(): Promise<Profile> {
  const profile = await getProfile()
  if (!profile) redirect(ROUTES.LOGIN)
  return profile
}

export async function requireRole(
  roles: UserRole | UserRole[]
): Promise<Profile> {
  const profile = await requireAuth()
  const allowed = Array.isArray(roles) ? roles : [roles]
  if (!allowed.includes(profile.role)) redirect(ROUTES.FORBIDDEN)
  return profile
}
