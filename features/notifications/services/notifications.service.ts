import { createClient } from "@/lib/supabase/browser.service"
import type { NotificationItem, NotificationType } from "../notifications.types"

export async function getNotifications(
  userId: string
): Promise<NotificationItem[]> {
  const supabase = createClient()

  const { data } = await supabase
    .from("notifications")
    .select("id, quote_id, type, message, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  return (data ?? []).map((n) => ({
    id: n.id,
    quoteId: n.quote_id,
    type: n.type as NotificationType,
    message: n.message ?? "",
    isRead: n.is_read ?? false,
    createdAt: n.created_at ?? new Date().toISOString(),
  }))
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  return count ?? 0
}

export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = createClient()

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)
}

export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createClient()

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
}
