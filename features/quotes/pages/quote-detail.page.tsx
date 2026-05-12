"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import { VERSION_STATUS } from "../constants/quote.constants"
import { useQuoteDetail } from "../hooks/use-quote-detail.hook"
import { QuoteDetailHeader } from "../components/quote-detail-header.component"
import { VersionTabs } from "../components/version-tabs.component"
import { ActivityTimeline } from "../components/activity-timeline.component"
import { EmailHistory } from "../components/email-history.component"
import { ExpiredBanner } from "../components/expired-banner.component"
import { ExtendExpiryDialog } from "../components/extend-expiry-dialog.component"

interface QuoteDetailPageProps {
  quoteId: string
}

export function QuoteDetailPage({ quoteId }: QuoteDetailPageProps) {
  const {
    quote,
    isLoading,
    selectedVersionId,
    setActiveVersionId,
    onCreateVersion,
    isCreatingVersion,
    openArchiveDialog,
    extendDialogOpen,
    setExtendDialogOpen,
    onExtendExpiry,
    isExtendingExpiry,
  } = useQuoteDetail(quoteId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-ink-mute">Quote not found.</p>
      </div>
    )
  }

  const isExpired =
    quote.expiresAt &&
    new Date(quote.expiresAt) < new Date() &&
    quote.status !== QUOTE_STATUS.ACCEPTED
  const hasDraftVersion = quote.versions.some(
    (v) => v.status === VERSION_STATUS.DRAFT
  )

  return (
    <div className="space-y-6">
      <QuoteDetailHeader
        title={quote.title}
        status={quote.status}
        clientName={quote.clientName}
        clientCompanyName={quote.clientCompanyName}
        quoteId={quote.id}
        hasDraftVersion={hasDraftVersion}
        onCreateVersion={onCreateVersion}
        isCreatingVersion={isCreatingVersion}
      />

      {isExpired && (
        <ExpiredBanner
          expiresAt={quote.expiresAt!}
          onExtend={() => setExtendDialogOpen(true)}
        />
      )}

      {/* Versions */}
      <div className="rounded-[10px] border border-hairline bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">Versions</h2>
        <VersionTabs
          versions={quote.versions}
          selectedVersionId={selectedVersionId}
          onSelectVersion={setActiveVersionId}
          currency={quote.currency}
          onArchive={openArchiveDialog}
        />
      </div>

      {/* Activity & Email side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[10px] border border-hairline bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Activity</h2>
          <ActivityTimeline activities={quote.activities} />
        </div>

        <div className="rounded-[10px] border border-hairline bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Email History</h2>
          <EmailHistory emails={quote.emails} />
        </div>
      </div>

      {/* Extend expiry dialog */}
      <ExtendExpiryDialog
        open={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
        onConfirm={onExtendExpiry}
        isPending={isExtendingExpiry}
      />
    </div>
  )
}
