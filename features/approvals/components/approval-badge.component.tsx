"use client"

import { SidebarMenuBadge } from "@/components/ui/sidebar"
import { useApprovalBadgeCount } from "../hooks/use-approval-badge-count.hook"

export function ApprovalBadge() {
  const count = useApprovalBadgeCount()
  if (count === 0) return null
  return (
    <SidebarMenuBadge className="bg-accent text-[10px] text-white">
      {count}
    </SidebarMenuBadge>
  )
}
