"use client"

import Link from "next/link"
import { ChevronRight, Inbox } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/lib/constants/routes.constants"
import type { ApprovalListItem } from "../approvals.types"
import { formatMoney } from "@/lib/utils/format.utils"

interface ApprovalInboxTableProps {
  approvals: ApprovalListItem[]
  isLoading: boolean
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

export function ApprovalInboxTable({
  approvals,
  isLoading,
}: ApprovalInboxTableProps) {
  if (!isLoading && approvals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-hairline bg-surface py-16">
        <Inbox size={24} strokeWidth={1.5} className="mb-3 text-ink-mute" />
        <p className="text-sm text-ink-mute">No pending approvals.</p>
      </div>
    )
  }

  return (
    <div className="rounded-[10px] border border-hairline bg-surface">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quote</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Rep</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Requested</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading &&
            approvals.map((a) => (
              <TableRow key={a.id} className="group">
                <TableCell>
                  <Link
                    href={ROUTES.MANAGER_APPROVAL_DETAIL(a.id)}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {a.quoteTitle}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-ink-soft">
                  {a.clientCompanyName ?? a.clientName ?? "No client"}
                </TableCell>
                <TableCell className="text-sm text-ink-soft">
                  {a.repName}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-amber tabular-nums">
                  {a.discountPercent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right font-mono text-sm tabular-nums">
                  {formatMoney(a.total, a.currency)}
                </TableCell>
                <TableCell className="text-right text-sm text-ink-mute">
                  {formatRelativeTime(a.requestedAt)}
                </TableCell>
                <TableCell>
                  <Link href={ROUTES.MANAGER_APPROVAL_DETAIL(a.id)}>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-ink-mute opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
