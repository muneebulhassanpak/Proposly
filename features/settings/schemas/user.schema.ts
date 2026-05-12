import { z } from "zod"

import { USER_ROLES } from "@/lib/constants/roles.constants"

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([USER_ROLES.MANAGER, USER_ROLES.REP]),
})

export const editRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.REP]),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type EditRoleFormData = z.infer<typeof editRoleSchema>
