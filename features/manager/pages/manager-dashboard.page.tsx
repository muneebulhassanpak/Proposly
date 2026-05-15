"use client"

import Link from "next/link"
import { CheckSquare, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROUTES } from "@/lib/constants/routes.constants"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import { useManagerQuotes } from "../hooks/use-manager-quotes.hook"
import { useManagerTable } from "../hooks/use-manager-table.hook"
import { ManagerSummaryCards } from "../components/manager-summary-cards.component"
import { ManagerQuotesTable } from "../components/manager-quotes-table.component"

interface ManagerDashboardPageProps {
  companyId: string
}

export function ManagerDashboardPage({ companyId }: ManagerDashboardPageProps) {
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
  } = useManagerQuotes(companyId)

  const { table, columns } = useManagerTable({
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Manager Dashboard</h1>
          <p className="mt-1 text-sm text-ink-mute">
            Company-wide pipeline overview.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.MANAGER_APPROVALS}>
            <CheckSquare size={14} strokeWidth={1.5} />
            Approval Inbox
          </Link>
        </Button>
      </div>

      <ManagerSummaryCards summary={summary} isLoading={isSummaryLoading} />

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
          <div className="ml-auto">
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
          </div>
        </div>

        <ManagerQuotesTable
          table={table}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
