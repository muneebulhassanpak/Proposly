import Link from "next/link"
import { ArrowLeft, Plus, Lock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants/routes.constants"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"

type BadgeVariant = "slate" | "amber" | "cobalt" | "moss" | "crimson"

function getStatusBadge(status: string): {
  label: string
  variant: BadgeVariant
} {
  switch (status) {
    case QUOTE_STATUS.DRAFT:
      return { label: "Draft", variant: "slate" }
    case QUOTE_STATUS.SENT:
      return { label: "Sent", variant: "cobalt" }
    case QUOTE_STATUS.OPENED:
      return { label: "Opened", variant: "cobalt" }
    case QUOTE_STATUS.PENDING_APPROVAL:
      return { label: "Pending Approval", variant: "amber" }
    case QUOTE_STATUS.APPROVED:
      return { label: "Approved", variant: "moss" }
    case QUOTE_STATUS.ACCEPTED:
      return { label: "Accepted", variant: "moss" }
    case QUOTE_STATUS.REJECTED:
      return { label: "Rejected", variant: "crimson" }
    case QUOTE_STATUS.EXPIRED:
      return { label: "Expired", variant: "amber" }
    case QUOTE_STATUS.LOST:
      return { label: "Lost", variant: "slate" }
    default:
      return { label: status, variant: "slate" }
  }
}

interface QuoteDetailHeaderProps {
  title: string
  status: string
  clientName: string | null
  clientCompanyName: string | null
  quoteId: string
  hasDraftVersion: boolean
  onCreateVersion: () => void
  isCreatingVersion: boolean
  isRep?: boolean
}

export function QuoteDetailHeader({
  title,
  status,
  clientName,
  clientCompanyName,
  quoteId,
  hasDraftVersion,
  onCreateVersion,
  isCreatingVersion,
  isRep = true,
}: QuoteDetailHeaderProps) {
  const { label, variant } = getStatusBadge(status)
  const isAccepted = status === QUOTE_STATUS.ACCEPTED
  const isDraft = status === QUOTE_STATUS.DRAFT
  const canCreateVersion = !isAccepted && !hasDraftVersion

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
        <Link href={isRep ? ROUTES.DASHBOARD : ROUTES.MANAGER_DASHBOARD}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-ink">{title}</h1>
            <Badge variant={variant}>{label}</Badge>
          </div>
          {(clientName || clientCompanyName) && (
            <p className="mt-1 text-sm text-ink-mute">
              {clientName}
              {clientCompanyName && ` · ${clientCompanyName}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isRep && isDraft && (
            <Button size="sm" asChild>
              <Link href={ROUTES.QUOTE(quoteId)}>Edit Draft</Link>
            </Button>
          )}
          {isAccepted && (
            <div className="flex items-center gap-1.5 text-sm text-moss">
              <Lock size={14} strokeWidth={1.5} />
              <span>Closed — accepted</span>
            </div>
          )}
          {isRep && canCreateVersion && (
            <Button
              size="sm"
              variant="outline"
              loading={isCreatingVersion}
              onClick={onCreateVersion}
            >
              <Plus size={14} strokeWidth={1.5} />
              New Version
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
