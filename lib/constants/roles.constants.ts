import type { UserRole } from "@/lib/auth.utils"

export const USER_ROLES = {
  ADMIN: "admin" as const,
  MANAGER: "manager" as const,
  REP: "rep" as const,
} satisfies Record<string, UserRole>

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  rep: "Rep",
}
