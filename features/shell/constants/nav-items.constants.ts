import type { LucideIcon } from "lucide-react"
import {
  BarChart2,
  CheckSquare,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Percent,
  Users,
} from "lucide-react"

import type { UserRole } from "@/lib/auth.utils"
import { ROUTES } from "@/lib/constants/routes.constants"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  rep: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Quotes", href: ROUTES.QUOTES, icon: FileText },
    { label: "Templates", href: ROUTES.TEMPLATES, icon: LayoutTemplate },
  ],
  manager: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Approvals", href: ROUTES.MANAGER_APPROVALS, icon: CheckSquare },
    { label: "Analytics", href: ROUTES.MANAGER_ANALYTICS, icon: BarChart2 },
    { label: "Quotes", href: ROUTES.QUOTES, icon: FileText },
  ],
  admin: [
    { label: "Product Catalog", href: ROUTES.ADMIN_CATALOG, icon: Package },
    {
      label: "Discount Rules",
      href: ROUTES.ADMIN_DISCOUNT_RULES,
      icon: Percent,
    },
    { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
  ],
}
