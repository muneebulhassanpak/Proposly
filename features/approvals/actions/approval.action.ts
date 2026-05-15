"use server"

import { requireAuth, requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import {
  requestApprovalSchema,
  approveSchema,
  rejectSchema,
} from "../schemas/approval.schema"
import {
  getPendingApprovals,
  getPendingApprovalCount,
  getApprovalDetail,
  requestApproval,
  approveQuote,
  rejectQuote,
} from "../services/approval.service"
import type { ApprovalListItem, ApprovalDetailData } from "../approvals.types"

export async function fetchPendingApprovalsAction(): Promise<
  ApprovalListItem[]
> {
  const profile = await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  return getPendingApprovals(profile.company_id!)
}

export async function fetchPendingApprovalCountAction(): Promise<number> {
  const profile = await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  return getPendingApprovalCount(profile.company_id!)
}

export async function fetchApprovalDetailAction(
  approvalId: string
): Promise<ApprovalDetailData | null> {
  await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  return getApprovalDetail(approvalId)
}

export async function requestApprovalAction(raw: unknown) {
  const profile = await requireAuth()
  const parsed = requestApprovalSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  return requestApproval(parsed.data, profile.id)
}

export async function approveQuoteAction(raw: unknown) {
  const profile = await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  const parsed = approveSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  return approveQuote(parsed.data, profile.id)
}

export async function rejectQuoteAction(raw: unknown) {
  const profile = await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  const parsed = rejectSchema.safeParse(raw)
  if (!parsed.success)
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  return rejectQuote(parsed.data, profile.id)
}
