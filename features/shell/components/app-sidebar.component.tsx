"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { UserRole } from "@/lib/auth.utils"
import { ROUTES } from "@/lib/constants/routes.constants"
import { USER_ROLES } from "@/lib/constants/roles.constants"
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
    pathname === ROUTES.ADMIN_SETTINGS ||
    pathname.startsWith(ROUTES.ADMIN_SETTINGS + "/")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-14 flex-row items-center border-b border-hairline px-4 py-0 group-data-[collapsible=icon]:ml-2.5 group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2.5">
          <Image
            src="/proposly-mark.svg"
            alt="Proposly"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span className="overflow-hidden font-display text-lg text-ink italic transition-[max-width,opacity] duration-200 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
            Proposly
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* New Proposal CTA */}
        <SidebarGroup className="px-3 pt-3 pb-1">
          <SidebarGroupContent>
            <SidebarMenuButton
              asChild
              tooltip="New Proposal"
              className="h-8 w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 data-[active=true]:bg-primary/90"
            >
              <Link href={ROUTES.NEW_QUOTE}>
                <Plus size={14} strokeWidth={1.5} />
                <span>New proposal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (href !== ROUTES.DASHBOARD && pathname.startsWith(href + "/"))
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
        {profile.role === USER_ROLES.ADMIN && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isAdminSettingsActive}
                    tooltip="Company Settings"
                  >
                    <Link href={ROUTES.ADMIN_SETTINGS}>
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
      <SidebarFooter className="border-t border-hairline p-3 group-data-[collapsible=icon]:px-0">
        <div className="flex items-center gap-2.5 px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-accent text-xs font-semibold text-white group-data-[collapsible=icon]:ml-2.5">
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
