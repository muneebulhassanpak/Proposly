import { z } from "zod"

export const lineItemSchema = z.object({
  product_id: z.string().uuid().nullable(),
  name: z.string().min(1, "Item name is required"),
  description: z.string().default(""),
  unit_price: z.number().min(0),
  cost_price: z.number().min(0).nullable(),
  quantity: z.number().min(0.001),
  unit: z.string().default("item"),
  sort_order: z.number().int(),
})

export const saveDraftSchema = z.object({
  quote_id: z.string().uuid().optional(),
  title: z.string().min(1, "Quote title is required"),
  client_id: z.string().uuid().nullable(),
  expires_at: z.string().nullable(),
  notes: z.string().default(""),
  line_items: z.array(lineItemSchema),
  discount_percent: z.number().min(0).max(100),
  tax_percent: z.number().min(0).max(100),
})

export type SaveDraftInput = z.infer<typeof saveDraftSchema>
