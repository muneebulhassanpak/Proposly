import { createClient } from "@/lib/supabase/browser.service"
import type { UserProfile } from "../settings.types"

export async function getUsersClient(): Promise<UserProfile[]> {
  const supabase = createClient()
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
