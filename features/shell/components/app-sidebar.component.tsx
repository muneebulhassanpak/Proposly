"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { UserRole } from "@/lib/auth.utils"
import { NAV_ITEMS } from "../constants/nav-items.constants"

interface AppSidebarProps {
  profile: {
    full_name: string | null
    email: string | null
    role: UserRole
  }
  companyName: string | null
}

function getInitials(name: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AppSidebar({ profile, companyName }: AppSidebarProps) {
  const pathname = usePathname()
  const items = NAV_ITEMS[profile.role]
  const isAdminSettingsActive =
    pathname === "/admin/settings" || pathname.startsWith("/admin/settings/")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <Image
            src="/proposly-mark.svg"
            alt="Proposly"
            width={28}
            height={28}
            className="shrink-0"
          />
          <span className="overflow-hidden font-display text-lg text-ink italic transition-[max-width,opacity] duration-200 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
            Proposly
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href + "/"))
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Link href={href}>
                        <Icon size={16} strokeWidth={1.5} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings — pushed to bottom of content */}
        {profile.role === "admin" && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isAdminSettingsActive}
                    tooltip="Company Settings"
                  >
                    <Link href="/admin/settings">
                      <Settings size={16} strokeWidth={1.5} />
                      <span>Company Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Profile footer */}
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-accent text-xs font-semibold text-white">
            {getInitials(profile.full_name)}
          </div>
          <div className="overflow-hidden transition-[max-width,opacity] duration-200 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
            <p className="truncate text-sm leading-tight font-medium text-ink">
              {profile.full_name ?? profile.email}
            </p>
            {companyName && (
              <p className="truncate text-xs leading-tight text-ink-mute">
                {companyName}
              </p>
            )}
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
