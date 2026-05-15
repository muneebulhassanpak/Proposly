"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server.service"
import { ROUTES } from "@/lib/constants/routes.constants"
import { forgotPasswordSchema, loginSchema } from "../schemas/auth.schema"

export async function loginAction(_prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: "Invalid email or password." }
  }

  redirect(ROUTES.DASHBOARD)
}

export async function forgotPasswordAction(
  _prevState: unknown,
  formData: FormData
) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { error: "Email is required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
    }
  )

  if (error) {
    return { error: "Could not send reset email. Try again." }
  }

  return { success: true }
}

export { logoutAction } from "@/lib/actions/auth.action"
