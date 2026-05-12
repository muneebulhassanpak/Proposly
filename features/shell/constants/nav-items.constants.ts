import type { LucideIcon } from "lucide-react"
import {
  BarChart2,
  CheckSquare,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Percent,
  Settings,
  Users,
} from "lucide-react"

import type { UserRole } from "@/lib/auth.utils"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  rep: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Quotes", href: "/quotes", icon: FileText },
    { label: "Templates", href: "/templates", icon: LayoutTemplate },
  ],
  manager: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Approvals", href: "/manager/approvals", icon: CheckSquare },
    { label: "Analytics", href: "/manager/analytics", icon: BarChart2 },
    { label: "Quotes", href: "/quotes", icon: FileText },
  ],
  admin: [
    { label: "Company Settings", href: "/admin/settings", icon: Settings },
    { label: "Product Catalog", href: "/admin/catalog", icon: Package },
    { label: "Discount Rules", href: "/admin/discount-rules", icon: Percent },
    { label: "Users", href: "/admin/users", icon: Users },
  ],
}
