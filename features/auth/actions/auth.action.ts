"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server.service"

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "Invalid email or password." }
  }

  redirect("/dashboard")
}

export async function forgotPasswordAction(
  _prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: "Could not send reset email. Try again." }
  }

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
