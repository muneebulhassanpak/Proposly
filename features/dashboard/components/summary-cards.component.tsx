"use client"

import { ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardSummary } from "../dashboard.types"

interface SummaryCardsProps {
  summary: DashboardSummary | undefined
  isLoading: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const CARDS = [
  { key: "totalQuotes" as const, label: "Total Quotes" },
  { key: "pendingApproval" as const, label: "Pending Approval" },
  { key: "sentCount" as const, label: "Sent" },
  { key: "acceptedThisMonth" as const, label: "Accepted This Month" },
]

export function SummaryCards({
  summary,
  isLoading,
  isCollapsed,
  onToggleCollapse,
}: SummaryCardsProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-mute">Summary</p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand summary" : "Collapse summary"}
        >
          {isCollapsed ? (
            <ChevronDown size={16} strokeWidth={1.5} />
          ) : (
            <ChevronUp size={16} strokeWidth={1.5} />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-[10px] border border-hairline bg-surface p-5"
            >
              <p className="text-xs font-medium tracking-wide text-ink-mute uppercase">
                {label}
              </p>
              <div className="mt-2 font-mono text-2xl font-semibold text-ink tabular-nums">
                {isLoading ? (
                  <Skeleton className="mt-1 h-7 w-12" />
                ) : (
                  (summary?.[key] ?? 0)
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
