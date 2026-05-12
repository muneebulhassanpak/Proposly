"use client"

import { History } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { usePriceHistory } from "../hooks/use-products.hook"

interface PriceHistoryDialogProps {
  productId: string
  productName: string
}

export function PriceHistoryDialog({
  productId,
  productName,
}: PriceHistoryDialogProps) {
  const { data: history, isLoading } = usePriceHistory(productId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <History size={14} strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Price history — {productName}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {!isLoading && !history?.length && (
          <p className="py-4 text-center text-sm text-ink-mute">
            No price changes recorded.
          </p>
        )}

        {!isLoading && !!history?.length && (
          <div className="divide-y divide-hairline">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-mono text-sm text-ink tabular-nums">
                    <span className="text-crimson">
                      {entry.old_price ?? "—"}
                    </span>
                    {" → "}
                    <span className="text-moss">{entry.new_price ?? "—"}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-mute">
                    {entry.changer_name ?? "Unknown"} ·{" "}
                    {entry.changed_at
                      ? new Date(entry.changed_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
