"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server.service"
import { ROUTES } from "@/lib/constants/routes.constants"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema"

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

  // Block deactivated users at login — sign out immediately
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active, role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.is_active === false) {
      await supabase.auth.signOut()
      return {
        error: "Your account has been deactivated. Contact your administrator.",
      }
    }

    if (
      profile.role === USER_ROLES.MANAGER ||
      profile.role === USER_ROLES.ADMIN
    ) {
      redirect(ROUTES.MANAGER_DASHBOARD)
    }
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

export async function resetPasswordAction(raw: {
  password: string
  confirmPassword: string
}) {
  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
