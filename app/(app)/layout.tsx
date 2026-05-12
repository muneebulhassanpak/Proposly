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
    .select("id, role, full_name, email, avatar_url, company_id")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  const { data: company } = profile.company_id
    ? await supabase
        .from("companies")
        .select("name")
        .eq("id", profile.company_id)
        .single()
    : { data: null }

  return (
    <Providers>
      <SidebarProvider className="h-svh">
        <AppSidebar profile={profile} companyName={company?.name ?? null} />
        <SidebarInset className="overflow-hidden">
          <TopNav profile={profile} />
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  )
}
