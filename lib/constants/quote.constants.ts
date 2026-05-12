export const QUOTE_STATUS = {
  DRAFT: "draft",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  SENT: "sent",
  OPENED: "opened",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EXPIRED: "expired",
  LOST: "lost",
} as const

export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS]

export const VERSION_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
  SUPERSEDED: "superseded",
} as const

export type VersionStatus = (typeof VERSION_STATUS)[keyof typeof VERSION_STATUS]
