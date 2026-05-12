"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardSummary } from "../dashboard.types"

interface SummaryCardsProps {
  summary: DashboardSummary | undefined
  isLoading: boolean
}

const CARDS = [
  { key: "totalQuotes" as const, label: "Total Quotes" },
  { key: "pendingApproval" as const, label: "Pending Approval" },
  { key: "sentCount" as const, label: "Sent" },
  { key: "acceptedThisMonth" as const, label: "Accepted This Month" },
]

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
  )
}
