export const ACTIVITY_EVENT = {
  QUOTE_CREATED: "quote_created",
  APPROVAL_REQUESTED: "approval_requested",
  APPROVED: "approved",
  REJECTED: "rejected",
  QUOTE_SENT: "quote_sent",
  QUOTE_OPENED: "quote_opened",
  ACCEPTED: "accepted",
  REJECTED_BY_CLIENT: "rejected_by_client",
  VERSION_CREATED: "version_created",
  VERSION_ARCHIVED: "version_archived",
  EXPIRY_EXTENDED: "expiry_extended",
} as const

export type ActivityEvent = (typeof ACTIVITY_EVENT)[keyof typeof ACTIVITY_EVENT]

export const ACTIVITY_EVENT_LABELS: Record<ActivityEvent, string> = {
  [ACTIVITY_EVENT.QUOTE_CREATED]: "Quote created",
  [ACTIVITY_EVENT.APPROVAL_REQUESTED]: "Approval requested",
  [ACTIVITY_EVENT.APPROVED]: "Quote approved",
  [ACTIVITY_EVENT.REJECTED]: "Quote rejected",
  [ACTIVITY_EVENT.QUOTE_SENT]: "Proposal sent",
  [ACTIVITY_EVENT.QUOTE_OPENED]: "Proposal opened by client",
  [ACTIVITY_EVENT.ACCEPTED]: "Proposal accepted",
  [ACTIVITY_EVENT.REJECTED_BY_CLIENT]: "Proposal declined by client",
  [ACTIVITY_EVENT.VERSION_CREATED]: "New version created",
  [ACTIVITY_EVENT.VERSION_ARCHIVED]: "Version archived",
  [ACTIVITY_EVENT.EXPIRY_EXTENDED]: "Expiry date extended",
}
