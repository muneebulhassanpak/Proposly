"use client"

import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCircle2,
  Eye,
  MessageSquare,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ROUTES } from "@/lib/constants/routes.constants"
import { useNotifications } from "../hooks/use-notifications.hook"
import type { NotificationType } from "../notifications.types"

function getIcon(type: NotificationType) {
  switch (type) {
    case "quote_opened":
      return <Eye size={16} strokeWidth={1.5} className="text-amber" />
    case "quote_accepted":
      return <CheckCircle2 size={16} strokeWidth={1.5} className="text-moss" />
    case "quote_rejected":
      return <XCircle size={16} strokeWidth={1.5} className="text-crimson" />
    case "approval_requested":
      return (
        <MessageSquare size={16} strokeWidth={1.5} className="text-accent" />
      )
    case "approval_approved":
      return <ShieldCheck size={16} strokeWidth={1.5} className="text-moss" />
    case "approval_rejected":
      return <ShieldX size={16} strokeWidth={1.5} className="text-crimson" />
    default:
      return <Bell size={16} strokeWidth={1.5} className="text-ink-mute" />
  }
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

interface NotificationPanelProps {
  userId: string
}

export function NotificationPanel({ userId }: NotificationPanelProps) {
  const router = useRouter()
  const {
    open,
    setOpen,
    notifications,
    isLoading,
    unreadCount,
    handleMarkAllRead,
    handleMarkOneRead,
    isMarkingAll,
  } = useNotifications(userId)

  function handleClick(notificationId: string, quoteId: string | null) {
    handleMarkOneRead(notificationId)
    setOpen(false)
    if (quoteId) {
      router.push(ROUTES.QUOTE(quoteId))
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative mr-1"
        >
          <Bell size={18} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex w-[380px] flex-col gap-0 p-0 sm:w-[420px]"
        showCloseButton={false}
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-hairline px-4 py-3">
          <SheetTitle className="text-base">Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
            >
              Mark all as read
            </Button>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 border-b border-hairline p-4">
                <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-sm text-ink-mute">
              <Bell size={24} strokeWidth={1.5} className="mb-2 opacity-40" />
              No notifications yet.
            </div>
          )}

          {!isLoading &&
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n.id, n.quoteId)}
                className={`flex w-full cursor-pointer items-start gap-3 border-b border-hairline p-4 text-left transition-colors hover:bg-paper ${
                  !n.isRead ? "bg-accent/[0.03]" : ""
                }`}
              >
                {!n.isRead && (
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                )}
                {n.isRead && <span className="w-1.5 shrink-0" />}
                <span className="mt-0.5 shrink-0">{getIcon(n.type)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{n.message}</p>
                  <p className="mt-0.5 text-xs text-ink-mute">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
