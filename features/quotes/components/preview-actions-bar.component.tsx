"use client"

import Link from "next/link"
import { ArrowLeft, Download, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SendQuoteDialog } from "./send-quote-dialog.component"

interface PreviewActionsBarProps {
  editHref: string
  quoteTitle: string
  clientEmail: string | null
  canSend: boolean
  onSend: () => void
  dialogOpen: boolean
  onDialogClose: () => void
  onDialogConfirm: () => void
  isSending: boolean
  onPrint: () => void
}

export function PreviewActionsBar({
  editHref,
  quoteTitle,
  clientEmail,
  canSend,
  onSend,
  dialogOpen,
  onDialogClose,
  onDialogConfirm,
  isSending,
  onPrint,
}: PreviewActionsBarProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Button variant="outline" size="sm" asChild>
          <Link href={editHref}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Edit
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Download size={14} strokeWidth={1.5} />
            Download PDF
          </Button>
          <Button size="sm" onClick={onSend} disabled={!canSend}>
            <Send size={14} strokeWidth={1.5} />
            Send to Client
          </Button>
        </div>
      </div>

      <SendQuoteDialog
        open={dialogOpen}
        onClose={onDialogClose}
        onConfirm={onDialogConfirm}
        isSending={isSending}
        clientEmail={clientEmail}
        quoteTitle={quoteTitle}
      />
    </>
  )
}
