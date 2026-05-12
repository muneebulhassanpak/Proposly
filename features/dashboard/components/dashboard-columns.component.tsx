"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants/routes.constants"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import type { DashboardQuote } from "../dashboard.types"

type BadgeVariant =
  | "slate"
  | "amber"
  | "cobalt"
  | "moss"
  | "crimson"
  | "default"

function getStatusBadge(
  status: string,
  hasPendingApproval: boolean
): { label: string; variant: BadgeVariant } {
  if (hasPendingApproval) return { label: "Pending Approval", variant: "amber" }

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

export function getDashboardColumns(): ColumnDef<DashboardQuote>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium text-ink">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => (
        <div>
          <p className="text-ink">{row.original.clientName ?? "—"}</p>
          {row.original.clientCompanyName && (
            <p className="text-xs text-ink-mute">
              {row.original.clientCompanyName}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "versionNumber",
      header: "Ver.",
      cell: ({ row }) => (
        <span className="text-ink-mute">v{row.original.versionNumber}</span>
      ),
    },
    {
      accessorKey: "total",
      header: "Value",
      cell: ({ row }) => (
        <span className="font-mono text-ink tabular-nums">
          {row.original.total.toLocaleString(undefined, {
            style: "currency",
            currency: row.original.currency,
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { label, variant } = getStatusBadge(
          row.original.status,
          row.original.hasPendingApproval
        )
        return <Badge variant={variant}>{label}</Badge>
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-ink-mute">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const id = row.original.id
        const isDraft = row.original.status === QUOTE_STATUS.DRAFT
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link href={ROUTES.QUOTE(id)}>
                {isDraft ? (
                  <Pencil size={14} strokeWidth={1.5} />
                ) : (
                  <Eye size={14} strokeWidth={1.5} />
                )}
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]
}
