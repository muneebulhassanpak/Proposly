import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DatePicker } from "@/components/ui/date-picker"

interface ExtendExpiryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (date: string) => void
  isPending: boolean
}

export function ExtendExpiryDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ExtendExpiryDialogProps) {
  const [date, setDate] = useState<Date | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Extend expiry date</DialogTitle>
          <DialogDescription>
            Pick a new expiry date for this quote.
          </DialogDescription>
        </DialogHeader>

        <DatePicker
          value={date}
          onChange={setDate}
          disablePast
          placeholder="Pick a new expiry date"
        />

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            loading={isPending}
            disabled={!date}
            onClick={() => date && onConfirm(date.toISOString())}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
