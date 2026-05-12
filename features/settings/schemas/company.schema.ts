import { z } from "zod"

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).nullable(),
  phone: z.string().nullable(),
  website: z.string().url("Invalid URL").or(z.literal("")).nullable(),
  address: z.string().nullable(),
  brand_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .nullable(),
  default_currency: z.string().min(1),
  default_tax_percent: z.coerce
    .number()
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
})

export type CompanyFormData = z.infer<typeof companySchema>
