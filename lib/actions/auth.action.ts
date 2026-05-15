"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server.service"
import { ROUTES } from "@/lib/constants/routes.constants"

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(ROUTES.LOGIN)
}
