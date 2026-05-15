"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (note: string) => void
  isRejecting: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
  isRejecting,
}: RejectDialogProps) {
  const [note, setNote] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject quote</DialogTitle>
          <DialogDescription>
            Provide a reason so the rep knows what to revise.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="reject-note">Rejection note</Label>
          <Textarea
            id="reject-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Discount too high for this client tier."
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-ink-mute">{note.length}/500</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={isRejecting}
            disabled={note.trim().length === 0}
            onClick={() => onConfirm(note.trim())}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
