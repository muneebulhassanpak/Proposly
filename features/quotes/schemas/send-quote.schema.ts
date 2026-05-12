import { z } from "zod"

export const sendQuoteSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
})

export type SendQuoteInput = z.infer<typeof sendQuoteSchema>
