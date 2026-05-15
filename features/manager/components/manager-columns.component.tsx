"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableSortableHeader } from "@/components/ui/data-table-sortable-header"
import { ROUTES } from "@/lib/constants/routes.constants"
import { QUOTE_STATUS } from "@/lib/constants/quote.constants"
import type { ManagerQuote } from "../manager.types"

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

export function getManagerColumns(): ColumnDef<ManagerQuote>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} label="Title" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-ink">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "clientName",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} label="Client" />
      ),
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
      accessorKey: "repName",
      header: "Rep",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-ink">{row.original.repName ?? "—"}</span>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} label="Value" />
      ),
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
      header: ({ column }) => (
        <DataTableSortableHeader column={column} label="Status" />
      ),
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
      header: ({ column }) => (
        <DataTableSortableHeader column={column} label="Updated" />
      ),
      cell: ({ row }) => (
        <span className="text-ink-mute">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
            <Link href={ROUTES.QUOTE(row.original.id)}>
              <Eye size={14} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      ),
    },
  ]
}
