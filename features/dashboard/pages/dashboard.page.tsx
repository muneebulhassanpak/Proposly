"use client"

import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserRole } from "@/lib/auth.utils"
import { ROUTES } from "@/lib/constants/routes.constants"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { useDashboardQuotes } from "../hooks/use-dashboard-quotes.hook"
import { useDashboardTable } from "../hooks/use-dashboard-table.hook"
import { SummaryCards } from "../components/summary-cards.component"
import { QuotesTable } from "../components/quotes-table.component"

interface DashboardPageProps {
  userId: string
  role: UserRole
}

export function DashboardPage({ userId, role }: DashboardPageProps) {
  const {
    summary,
    isSummaryLoading,
    quotes,
    pageCount,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sorting,
    setSorting,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    isRefetching,
    refetch,
  } = useDashboardQuotes(userId)

  const { table, columns } = useDashboardTable({
    quotes,
    pageCount,
    sorting,
    onSortingChange: setSorting,
    pageIndex,
    pageSize,
    onPageIndexChange: setPageIndex,
    onPageSizeChange: setPageSize,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-mute">Your quotes at a glance.</p>
      </div>

      <SummaryCards summary={summary} isLoading={isSummaryLoading} />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by title or client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value={QUOTE_STATUS.DRAFT}>Draft</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value={QUOTE_STATUS.SENT}>Sent</SelectItem>
              <SelectItem value={QUOTE_STATUS.OPENED}>Opened</SelectItem>
              <SelectItem value={QUOTE_STATUS.ACCEPTED}>Accepted</SelectItem>
              <SelectItem value={QUOTE_STATUS.REJECTED}>Rejected</SelectItem>
              <SelectItem value={QUOTE_STATUS.EXPIRED}>Expired</SelectItem>
              <SelectItem value={QUOTE_STATUS.LOST}>Lost</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={refetch}
              disabled={isRefetching}
            >
              <RefreshCw
                size={14}
                strokeWidth={1.5}
                className={isRefetching ? "animate-spin" : ""}
              />
            </Button>
            {role === USER_ROLES.REP && (
              <Button size="sm" asChild>
                <Link href={ROUTES.NEW_QUOTE}>
                  <Plus size={14} strokeWidth={1.5} />
                  New Quote
                </Link>
              </Button>
            )}
          </div>
        </div>

        <QuotesTable table={table} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}
