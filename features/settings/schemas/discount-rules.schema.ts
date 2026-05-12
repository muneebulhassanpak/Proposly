import { z } from "zod"

export const discountRuleSchema = z.object({
  threshold_percent: z.coerce
    .number()
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
})

export type DiscountRuleFormData = z.infer<typeof discountRuleSchema>
