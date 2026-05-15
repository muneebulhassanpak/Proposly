"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

import { createClient } from "@/lib/supabase/browser.service"
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../services/notifications.service"

const NOTIFICATIONS_KEY = "notifications"
const UNREAD_COUNT_KEY = "notifications-unread-count"

export function useNotifications(userId: string) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const notificationsQuery = useQuery({
    queryKey: [NOTIFICATIONS_KEY, userId],
    queryFn: () => getNotifications(userId),
    enabled: open,
  })

  const unreadCountQuery = useQuery({
    queryKey: [UNREAD_COUNT_KEY, userId],
    queryFn: () => getUnreadCount(userId),
  })

  const markAllMutation = useMutation({
    mutationFn: () => markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY, userId] })
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY, userId] })
    },
  })

  const markOneMutation = useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY, userId] })
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY, userId] })
    },
  })

  // Supabase Realtime — listen for new notifications for this user
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: [UNREAD_COUNT_KEY, userId],
          })
          if (open) {
            queryClient.invalidateQueries({
              queryKey: [NOTIFICATIONS_KEY, userId],
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient, open])

  return {
    open,
    setOpen,
    notifications: notificationsQuery.data ?? [],
    isLoading: notificationsQuery.isLoading,
    unreadCount: unreadCountQuery.data ?? 0,
    handleMarkAllRead: () => markAllMutation.mutate(),
    handleMarkOneRead: (id: string) => markOneMutation.mutate(id),
    isMarkingAll: markAllMutation.isPending,
  }
}
