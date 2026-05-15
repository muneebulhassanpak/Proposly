"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROUTES } from "@/lib/constants/routes.constants"
import { APPROVAL_STATUS } from "../constants/approval.constants"
import { formatMoney } from "@/lib/utils/format.utils"
import { useApprovalDetail } from "../hooks/use-approval-detail.hook"
import { RejectDialog } from "../components/reject-dialog.component"

interface ApprovalDetailPageProps {
  approvalId: string
}

export function ApprovalDetailPage({ approvalId }: ApprovalDetailPageProps) {
  const {
    approval,
    isLoading,
    approve,
    isApproving,
    rejectDialogOpen,
    setRejectDialogOpen,
    reject,
    isRejecting,
  } = useApprovalDetail(approvalId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!approval) {
    return (
      <div className="py-16 text-center text-sm text-ink-mute">
        Approval not found.
      </div>
    )
  }

  const isPending = approval.status === APPROVAL_STATUS.PENDING

  return (
    <div>
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href={ROUTES.MANAGER_APPROVALS}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Approvals
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">
            {approval.quoteTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-mute">
            Requested by {approval.repName} &middot; v{approval.versionNumber}
          </p>
        </div>
        {isPending && (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectDialogOpen(true)}
              disabled={isApproving}
            >
              <XCircle size={14} strokeWidth={1.5} />
              Reject
            </Button>
            <Button size="sm" loading={isApproving} onClick={approve}>
              <CheckCircle2 size={14} strokeWidth={1.5} />
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left — Line items */}
        <div className="rounded-[10px] border border-hairline bg-surface p-6">
          <h2 className="mb-4 text-sm font-medium text-ink">Line items</h2>
          {approval.lineItems.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-20 text-right">Qty</TableHead>
                    <TableHead className="w-28 text-right">
                      Unit Price
                    </TableHead>
                    <TableHead className="w-28 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approval.lineItems.map((li) => (
                    <TableRow key={li.id}>
                      <TableCell>
                        <p className="font-medium text-ink">{li.name}</p>
                        {li.description && (
                          <p className="text-xs text-ink-mute">
                            {li.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {li.quantity}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatMoney(li.unit_price, approval.currency)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatMoney(li.line_total, approval.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-4 ml-auto w-64">
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-ink-mute">Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {formatMoney(approval.subtotal, approval.currency)}
                  </span>
                </div>
                {approval.discountPercent > 0 && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-ink-mute">
                      Discount ({approval.discountPercent}%)
                    </span>
                    <span className="font-mono text-crimson tabular-nums">
                      −{formatMoney(approval.discountAmount, approval.currency)}
                    </span>
                  </div>
                )}
                {approval.taxPercent > 0 && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-ink-mute">
                      Tax ({approval.taxPercent}%)
                    </span>
                    <span className="font-mono tabular-nums">
                      {formatMoney(approval.taxAmount, approval.currency)}
                    </span>
                  </div>
                )}
                <Separator className="my-1" />
                <div className="flex justify-between py-1 text-sm font-semibold">
                  <span className="text-ink">Total</span>
                  <span className="font-mono tabular-nums">
                    {formatMoney(approval.total, approval.currency)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-ink-mute">
              No line items.
            </p>
          )}
        </div>

        {/* Right column — details + margin */}
        <div className="space-y-4">
          {/* Quote info */}
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <h2 className="mb-3 text-sm font-medium text-ink">Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-mute">Client</dt>
                <dd className="text-right text-ink">
                  {approval.clientCompanyName ??
                    approval.clientName ??
                    "No client"}
                </dd>
              </div>
              {approval.clientEmail && (
                <div className="flex justify-between">
                  <dt className="text-ink-mute">Email</dt>
                  <dd className="text-right text-ink">
                    {approval.clientEmail}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-mute">Requested by</dt>
                <dd className="text-right text-ink">{approval.repName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-mute">Requested</dt>
                <dd className="text-right text-ink">
                  {new Date(approval.requestedAt).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Margin breakdown */}
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <p className="mb-3 text-xs font-medium tracking-wide text-ink-mute uppercase">
              Margin analysis
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-mute">Total cost</span>
                <span className="font-mono text-ink-mute tabular-nums">
                  {formatMoney(approval.totalCost, approval.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-mute">Revenue</span>
                <span className="font-mono text-ink tabular-nums">
                  {formatMoney(approval.total, approval.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-hairline pt-2">
                <span className="font-medium text-ink">Gross margin</span>
                <span
                  className={`font-mono font-medium tabular-nums ${
                    approval.grossMarginPercent >= 30
                      ? "text-moss"
                      : approval.grossMarginPercent >= 10
                        ? "text-amber"
                        : "text-crimson"
                  }`}
                >
                  {approval.grossMarginPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject dialog */}
      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={reject}
        isRejecting={isRejecting}
      />
    </div>
  )
}
