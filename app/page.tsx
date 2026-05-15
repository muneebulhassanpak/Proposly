import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server.service"
import { ROUTES } from "@/lib/constants/routes.constants"
import { USER_ROLES } from "@/lib/constants/roles.constants"

export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role

  if (role === USER_ROLES.MANAGER || role === USER_ROLES.ADMIN) {
    redirect(ROUTES.MANAGER_DASHBOARD)
  }

  redirect(ROUTES.DASHBOARD)
}
