import {
  FileText,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  GitBranch,
  Archive,
  Clock,
  ShieldCheck,
  ShieldX,
  CalendarClock,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  ACTIVITY_EVENT,
  ACTIVITY_EVENT_LABELS,
} from "../constants/activity-events.constants"
import type { ActivityEvent } from "../constants/activity-events.constants"
import type { ActivityLogEntry } from "../quotes.types"

const EVENT_ICONS: Record<ActivityEvent, LucideIcon> = {
  [ACTIVITY_EVENT.QUOTE_CREATED]: FileText,
  [ACTIVITY_EVENT.APPROVAL_REQUESTED]: ShieldCheck,
  [ACTIVITY_EVENT.APPROVED]: ShieldCheck,
  [ACTIVITY_EVENT.REJECTED]: ShieldX,
  [ACTIVITY_EVENT.QUOTE_SENT]: Send,
  [ACTIVITY_EVENT.QUOTE_OPENED]: Eye,
  [ACTIVITY_EVENT.ACCEPTED]: CheckCircle2,
  [ACTIVITY_EVENT.REJECTED_BY_CLIENT]: XCircle,
  [ACTIVITY_EVENT.VERSION_CREATED]: GitBranch,
  [ACTIVITY_EVENT.VERSION_ARCHIVED]: Archive,
  [ACTIVITY_EVENT.EXPIRY_EXTENDED]: CalendarClock,
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

interface ActivityTimelineProps {
  activities: ActivityLogEntry[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-mute">No activity yet.</p>
    )
  }

  return (
    <div className="space-y-0">
      {activities.map((a, i) => {
        const Icon = EVENT_ICONS[a.event as ActivityEvent] ?? Clock
        const label = ACTIVITY_EVENT_LABELS[a.event as ActivityEvent] ?? a.event
        const isLast = i === activities.length - 1

        return (
          <div key={a.id} className="flex gap-3">
            {/* Timeline track */}
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface">
                <Icon size={14} strokeWidth={1.5} className="text-ink-mute" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-hairline" />}
            </div>

            {/* Content */}
            <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
              <p className="text-sm font-medium text-ink">
                {label}
                {a.versionNumber != null && (
                  <span className="text-ink-mute"> · V{a.versionNumber}</span>
                )}
              </p>
              <p className="text-xs text-ink-mute">
                {a.actorName ?? "System"} · {formatRelativeTime(a.createdAt)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
