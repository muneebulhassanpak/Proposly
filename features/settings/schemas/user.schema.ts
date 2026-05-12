import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["manager", "rep"]),
})

export const editRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "manager", "rep"]),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type EditRoleFormData = z.infer<typeof editRoleSchema>
