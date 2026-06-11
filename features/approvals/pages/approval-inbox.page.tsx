"use client"

import { Input } from "@/components/ui/input"
import { useApprovalInbox } from "../hooks/use-approval-inbox.hook"
import { useApprovalInboxTable } from "../hooks/use-approval-inbox-table.hook"
import { ApprovalInboxTable } from "../components/approval-inbox-table.component"

export function ApprovalInboxPage() {
  const {
    approvals,
    totalCount,
    pageCount,
    isLoading,
    search,
    setSearch,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
  } = useApprovalInbox()

  const { table, columns } = useApprovalInboxTable({
    approvals,
    pageCount,
    pageIndex,
    pageSize,
    onPageIndexChange: setPageIndex,
    onPageSizeChange: setPageSize,
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Approval Inbox</h1>
        <p className="mt-1 text-sm text-ink-mute">
          Review and approve quotes with high discounts.
        </p>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by quote, client, or rep..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      <ApprovalInboxTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        isEmpty={totalCount === 0 && !search}
      />
    </div>
  )
}
