"use client"

import { ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatMoney } from "@/lib/utils/format.utils"
import type { ManagerSummary } from "../manager.types"

interface ManagerSummaryCardsProps {
  summary: ManagerSummary | undefined
  isLoading: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function ManagerSummaryCards({
  summary,
  isLoading,
  isCollapsed,
  onToggleCollapse,
}: ManagerSummaryCardsProps) {
  const cards = [
    {
      label: "Pipeline Value",
      value: summary
        ? formatMoney(summary.pipelineValue, summary.currency)
        : null,
      mono: true,
    },
    {
      label: "Quotes Sent",
      value: summary ? String(summary.quotesSent) : null,
      mono: true,
    },
    {
      label: "Accepted This Month",
      value: summary ? String(summary.acceptedThisMonth) : null,
      mono: true,
    },
    {
      label: "Win Rate",
      value: summary ? `${summary.winRate}%` : null,
      mono: true,
    },
  ]

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
          {cards.map(({ label, value, mono }) => (
            <div
              key={label}
              className="rounded-[10px] border border-hairline bg-surface p-5"
            >
              <p className="text-xs font-medium tracking-wide text-ink-mute uppercase">
                {label}
              </p>
              <div
                className={`mt-2 text-2xl font-semibold text-ink tabular-nums ${mono ? "font-mono" : ""}`}
              >
                {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
