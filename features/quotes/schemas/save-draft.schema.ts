import { z } from "zod"

import { lineItemFieldsSchema } from "./quote-builder.schema"

// Extends shared field constraints with server-side defaults
export const lineItemSchema = lineItemFieldsSchema.extend({
  description: z.string().default(""),
  unit: z.string().default("item"),
})

export const saveDraftSchema = z
  .object({
    quote_id: z.string().uuid().optional(),
    title: z.string().min(1, "Quote title is required").max(100),
    client_id: z.string().uuid().nullable(),
    expires_at: z.string().nullable(),
    notes: z.string().default(""),
    line_items: z.array(lineItemSchema),
    discount_percent: z.number().min(0).max(100),
    tax_percent: z.number().min(0).max(100),
  })
  .refine(
    (data) => {
      const productIds = data.line_items
        .map((i) => i.product_id)
        .filter((id): id is string => id !== null)
      return productIds.length === new Set(productIds).size
    },
    { message: "Duplicate catalog items are not allowed", path: ["line_items"] }
  )

export type SaveDraftInput = z.infer<typeof saveDraftSchema>
