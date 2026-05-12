import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { Providers } from "@/components/providers.component"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/shell/components/app-sidebar.component"
import { TopNav } from "@/features/shell/components/top-nav.component"
import { createClient } from "@/lib/supabase/server.service"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, avatar_url")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  return (
    <Providers>
      <SidebarProvider className="h-svh">
        <AppSidebar role={profile.role} />
        <SidebarInset className="overflow-hidden">
          <TopNav profile={profile} />
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  )
}
