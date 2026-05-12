import { z } from "zod"

// Shared field constraints — imported by save-draft.schema.ts (server).
// Any change here must be reflected there and vice-versa.
export const lineItemFieldsSchema = z.object({
  product_id: z.string().uuid().nullable(),
  name: z.string().min(1, "Item name is required").max(100),
  description: z.string(),
  unit_price: z.number().min(0),
  cost_price: z.number().min(0).nullable(),
  quantity: z.number().int().min(1),
  unit: z.string(),
  sort_order: z.number().int(),
})

// Client-only: adds localId used for drag-and-drop keying
const formLineItemSchema = lineItemFieldsSchema.extend({
  localId: z.string(),
})

export const quoteBuilderSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  client_id: z.string().nullable(),
  expires_at: z.date().nullable(),
  notes: z.string(),
  line_items: z.array(formLineItemSchema),
  discount_percent: z.number().min(0).max(100),
  tax_percent: z.number().min(0).max(100),
})

export type QuoteBuilderFormData = z.infer<typeof quoteBuilderSchema>
