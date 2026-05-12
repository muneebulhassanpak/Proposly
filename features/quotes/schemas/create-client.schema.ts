import { z } from "zod"

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z
    .string()
    .email("Invalid email")
    .max(255)
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  company_name: z
    .string()
    .max(100)
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  phone: z
    .string()
    .max(50)
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
})

export type CreateClientFormData = z.infer<typeof createClientSchema>
