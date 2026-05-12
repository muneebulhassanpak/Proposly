"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/auth.utils"
import { NAV_ITEMS } from "../constants/nav-items.constants"

interface AppSidebarProps {
  role: UserRole
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname()
  const items = NAV_ITEMS[role]

  return (
    <aside className="hidden w-60 shrink-0 border-r border-hairline bg-surface lg:flex lg:flex-col">
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href + "/"))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-paper font-medium text-ink"
                  : "text-ink-mute hover:bg-paper hover:text-ink"
              )}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
