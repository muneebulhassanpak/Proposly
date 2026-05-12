import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  category: z.string().nullable(),
  unit: z.enum(["hour", "page", "project", "item", "word", "custom"]),
  unit_price: z.coerce.number().min(0, "Cannot be negative"),
  cost_price: z.coerce.number().min(0, "Cannot be negative").nullable(),
  is_active: z.boolean(),
})

export type ProductFormData = z.infer<typeof productSchema>
