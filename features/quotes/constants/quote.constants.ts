export const QUOTE_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  VIEWED: "viewed",
  ACCEPTED: "accepted",
  DECLINED: "declined",
} as const

export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS]
