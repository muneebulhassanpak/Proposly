export type NotificationType =
  | "quote_opened"
  | "quote_accepted"
  | "quote_rejected"
  | "approval_requested"
  | "approval_approved"
  | "approval_rejected"

export type NotificationItem = {
  id: string
  quoteId: string | null
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: string
}
