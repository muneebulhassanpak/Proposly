import { z } from "zod"

export const requestApprovalSchema = z.object({
  quoteId: z.string().uuid(),
  versionId: z.string().uuid(),
})

export type RequestApprovalInput = z.infer<typeof requestApprovalSchema>

export const approveSchema = z.object({
  approvalId: z.string().uuid(),
})

export type ApproveInput = z.infer<typeof approveSchema>

export const rejectSchema = z.object({
  approvalId: z.string().uuid(),
  note: z.string().min(1, "A rejection note is required").max(500),
})

export type RejectInput = z.infer<typeof rejectSchema>
