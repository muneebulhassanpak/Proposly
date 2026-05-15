import Image from "next/image"
import { AlertTriangle, Clock } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import { formatMoney } from "@/lib/utils/format.utils"
import type { ProposalData } from "../proposal.types"
import { ProposalActions } from "../components/proposal-actions.component"

interface PublicProposalPageProps {
  proposal: ProposalData
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

function isExpiringSoon(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  const expiry = new Date(expiresAt)
  const now = new Date()
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)
  return hoursLeft > 0 && hoursLeft <= 48
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function PublicProposalPage({ proposal }: PublicProposalPageProps) {
  const expired = isExpired(proposal.expiresAt)
  const expiringSoon = !expired && isExpiringSoon(proposal.expiresAt)
  const isAccepted = proposal.status === QUOTE_STATUS.ACCEPTED
  const isRejected = proposal.status === QUOTE_STATUS.REJECTED
  const isDecided = isAccepted || isRejected
  const showActions = !expired && !isDecided

  return (
    <div className="min-h-svh bg-paper">
      {/* Branded header bar */}
      <div
        className="h-1.5"
        style={{ backgroundColor: proposal.companyBrandColor }}
      />

      <div className="mx-auto max-w-[820px] px-6 py-10 print:px-0 print:py-0">
        {/* Company header */}
        <div className="mb-8 flex items-center gap-3">
          {proposal.companyLogoUrl && (
            <Image
              src={proposal.companyLogoUrl}
              alt={proposal.companyName}
              width={40}
              height={40}
              className="rounded-[6px]"
            />
          )}
          <span className="text-lg font-semibold text-ink">
            {proposal.companyName}
          </span>
        </div>

        {/* Expired banner */}
        {expired && (
          <div className="mb-6 flex items-start gap-2.5 rounded-[10px] border border-crimson/30 bg-crimson/10 px-4 py-3">
            <AlertTriangle
              size={16}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-crimson"
            />
            <p className="text-sm text-crimson">
              This proposal expired on {formatDate(proposal.expiresAt!)}. Please
              contact us for an updated quote.
            </p>
          </div>
        )}

        {/* Accepted/rejected banner */}
        {isAccepted && (
          <div className="mb-6 rounded-[10px] border border-moss/30 bg-moss/10 px-4 py-3">
            <p className="text-sm text-moss">
              You accepted this proposal
              {proposal.acceptedAt && ` on ${formatDate(proposal.acceptedAt)}`}.
            </p>
          </div>
        )}
        {isRejected && (
          <div className="mb-6 rounded-[10px] border border-crimson/30 bg-crimson/10 px-4 py-3">
            <p className="text-sm text-crimson">You declined this proposal.</p>
          </div>
        )}

        {/* Main card */}
        <div className="rounded-[10px] border border-hairline bg-surface p-8">
          {/* Title + meta */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-ink">
              {proposal.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-mute">
              <span className="font-mono">{proposal.quoteNumber}</span>
              <span>Issued {formatDate(proposal.issuedAt)}</span>
              {proposal.expiresAt && !expired && (
                <span className="flex items-center gap-1">
                  {expiringSoon && (
                    <Clock
                      size={14}
                      strokeWidth={1.5}
                      className="text-crimson"
                    />
                  )}
                  <span className={expiringSoon ? "text-crimson" : ""}>
                    Expires {formatDate(proposal.expiresAt)}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Client */}
          {(proposal.clientName || proposal.clientCompanyName) && (
            <div className="mb-6 text-sm">
              <p className="mb-1 text-xs font-medium tracking-wide text-ink-mute uppercase">
                Prepared for
              </p>
              {proposal.clientName && (
                <p className="font-medium text-ink">{proposal.clientName}</p>
              )}
              {proposal.clientCompanyName && (
                <p className="text-ink-soft">{proposal.clientCompanyName}</p>
              )}
            </div>
          )}

          <Separator className="mb-6" />

          {/* Line items table */}
          {proposal.lineItems.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-20 text-right">Qty</TableHead>
                  <TableHead className="w-28 text-right">Unit Price</TableHead>
                  <TableHead className="w-28 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposal.lineItems.map((li) => (
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
                      {formatMoney(li.unit_price, proposal.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatMoney(li.line_total, proposal.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Totals */}
          <div className="mt-6 ml-auto w-64">
            <div className="flex justify-between py-1 text-sm">
              <span className="text-ink-mute">Subtotal</span>
              <span className="font-mono tabular-nums">
                {formatMoney(proposal.subtotal, proposal.currency)}
              </span>
            </div>
            {proposal.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="text-ink-mute">Discount</span>
                <span className="font-mono text-crimson tabular-nums">
                  −{formatMoney(proposal.discountAmount, proposal.currency)}
                </span>
              </div>
            )}
            {proposal.taxAmount > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="text-ink-mute">Tax</span>
                <span className="font-mono tabular-nums">
                  {formatMoney(proposal.taxAmount, proposal.currency)}
                </span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between py-1 text-base font-semibold">
              <span className="text-ink">Total</span>
              <span className="font-mono tabular-nums">
                {formatMoney(proposal.total, proposal.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-6 print:hidden">
            <ProposalActions proposal={proposal} />
          </div>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-ink-mute print:hidden">
          Powered by <span className="font-display italic">Proposly</span>
        </p>
      </div>
    </div>
  )
}
