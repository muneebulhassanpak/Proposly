"use client"

import { useApprovalInbox } from "../hooks/use-approval-inbox.hook"
import { ApprovalInboxTable } from "../components/approval-inbox-table.component"

export function ApprovalInboxPage() {
  const { approvals, isLoading } = useApprovalInbox()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Approval Inbox</h1>
        <p className="mt-1 text-sm text-ink-mute">
          Review and approve quotes with high discounts.
        </p>
      </div>
      <ApprovalInboxTable approvals={approvals} isLoading={isLoading} />
    </div>
  )
}
