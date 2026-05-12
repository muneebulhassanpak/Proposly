"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SendQuoteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isSending: boolean
  clientEmail: string | null
  quoteTitle: string
}

export function SendQuoteDialog({
  open,
  onClose,
  onConfirm,
  isSending,
  clientEmail,
  quoteTitle,
}: SendQuoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Send proposal?</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-ink-mute">
          <p>
            This will send{" "}
            <span className="font-medium text-ink">{quoteTitle}</span> to:
          </p>
          <p className="font-mono font-medium text-ink">
            {clientEmail ?? "No email on file"}
          </p>
          <p>
            The client will receive a link to the read-only proposal page. The
            quote status will change to Sent and can no longer be edited.
          </p>
        </div>
        <DialogFooter showCloseButton>
          <Button
            loading={isSending}
            onClick={onConfirm}
            disabled={!clientEmail}
          >
            Send proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
