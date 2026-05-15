import { NextResponse, type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"
import { ROUTES } from "@/lib/constants/routes.constants"

const PUBLIC_ROUTES: Set<string> = new Set([
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
])
const PUBLIC_PREFIXES = ["/p/", "/auth/"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic =
    PUBLIC_ROUTES.has(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (isPublic) return NextResponse.next()

  const { supabaseResponse, user, supabase } = await updateSession(request)

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.LOGIN
    return NextResponse.redirect(url)
  }

  // Block deactivated users — sign them out and bounce to login
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", user.id)
    .single()

  if (!profile || profile.is_active === false) {
    await supabase.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.LOGIN
    url.searchParams.set("reason", "deactivated")
    const redirectResponse = NextResponse.redirect(url)
    // Copy auth-clearing cookies from the supabase response to the redirect
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    }
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
