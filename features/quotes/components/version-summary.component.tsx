import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import type { QuoteDetailVersion } from "../quotes.types"
import { formatMoney } from "../utils/quote.utils"

interface VersionSummaryProps {
  version: QuoteDetailVersion
  currency: string
}

export function VersionSummary({ version, currency }: VersionSummaryProps) {
  return (
    <div className="flex-1 space-y-4">
      {/* Line items table */}
      {version.lineItems.length > 0 && (
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
            {version.lineItems.map((li) => (
              <TableRow key={li.id}>
                <TableCell>
                  <p className="font-medium text-ink">{li.name}</p>
                  {li.description && (
                    <p className="text-xs text-ink-mute">{li.description}</p>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {li.quantity}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatMoney(li.unit_price, currency)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatMoney(li.line_total, currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Totals */}
      <div className="ml-auto w-64">
        <div className="flex justify-between py-1 text-sm">
          <span className="text-ink-mute">Subtotal</span>
          <span className="font-mono tabular-nums">
            {formatMoney(version.subtotal, currency)}
          </span>
        </div>
        {version.discountPercent > 0 && (
          <div className="flex justify-between py-1 text-sm">
            <span className="text-ink-mute">
              Discount ({version.discountPercent}%)
            </span>
            <span className="font-mono text-crimson tabular-nums">
              −{formatMoney(version.discountAmount, currency)}
            </span>
          </div>
        )}
        {version.taxPercent > 0 && (
          <div className="flex justify-between py-1 text-sm">
            <span className="text-ink-mute">Tax ({version.taxPercent}%)</span>
            <span className="font-mono tabular-nums">
              {formatMoney(version.taxAmount, currency)}
            </span>
          </div>
        )}
        <Separator className="my-1" />
        <div className="flex justify-between py-1 text-sm font-semibold">
          <span className="text-ink">Total</span>
          <span className="font-mono tabular-nums">
            {formatMoney(version.total, currency)}
          </span>
        </div>
      </div>
    </div>
  )
}
