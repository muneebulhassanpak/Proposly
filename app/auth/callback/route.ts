import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server.service"
import { ROUTES } from "@/lib/constants/routes.constants"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? ROUTES.DASHBOARD

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}${ROUTES.LOGIN}?error=auth`)
}
