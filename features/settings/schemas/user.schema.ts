import { z } from "zod"

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["manager", "rep"]),
})

export const editRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "manager", "rep"]),
})

export type InviteUserFormData = z.infer<typeof inviteUserSchema>
export type EditRoleFormData = z.infer<typeof editRoleSchema>
