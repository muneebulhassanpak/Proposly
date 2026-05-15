import { z } from "zod"

export const createVersionSchema = z.object({
  quoteId: z.string().uuid(),
})

export type CreateVersionInput = z.infer<typeof createVersionSchema>

export const archiveVersionSchema = z.object({
  versionId: z.string().uuid(),
  quoteId: z.string().uuid(),
})

export type ArchiveVersionInput = z.infer<typeof archiveVersionSchema>

export const extendExpirySchema = z.object({
  quoteId: z.string().uuid(),
  expiresAt: z.string().min(1, "Expiry date is required"),
})

export type ExtendExpiryInput = z.infer<typeof extendExpirySchema>
