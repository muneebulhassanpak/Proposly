"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, MessageSquare, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  acceptProposalAction,
  rejectProposalAction,
  askQuestionAction,
} from "../actions/proposal.action"
import type { ProposalData } from "../proposal.types"

interface ProposalActionsProps {
  proposal: ProposalData
}

export function ProposalActions({ proposal }: ProposalActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [questionOpen, setQuestionOpen] = useState(false)
  const [questionText, setQuestionText] = useState("")

  function handleAccept() {
    startTransition(async () => {
      const result = await acceptProposalAction({
        quoteId: proposal.quoteId,
        versionId: proposal.versionId,
      })
      if (result.success) {
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectProposalAction({
        quoteId: proposal.quoteId,
        versionId: proposal.versionId,
        reason: rejectReason.trim() || undefined,
      })
      if (result.success) {
        setRejectOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleQuestion() {
    if (!proposal.repEmail) {
      toast.error("Unable to send question.")
      return
    }
    startTransition(async () => {
      const result = await askQuestionAction({
        quoteId: proposal.quoteId,
        repEmail: proposal.repEmail!,
        quoteTitle: proposal.title,
        publicToken: proposal.publicToken,
        message: questionText.trim(),
      })
      if (result.success) {
        setQuestionOpen(false)
        setQuestionText("")
        toast.success("Your question has been sent.")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Accept */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" disabled={isPending}>
            <CheckCircle2 size={16} strokeWidth={1.5} />
            Accept Proposal
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept this proposal?</AlertDialogTitle>
            <AlertDialogDescription>
              This confirms your agreement. The team will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept} disabled={isPending}>
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" disabled={isPending}>
            <XCircle size={16} strokeWidth={1.5} />
            Decline
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline this proposal</DialogTitle>
            <DialogDescription>
              Let us know why so we can improve.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason">
              Reason{" "}
              <span className="font-normal text-ink-mute">(optional)</span>
            </Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Budget constraints, went with another provider…"
              rows={3}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending}
            >
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask a Question */}
      {proposal.repEmail && (
        <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="lg" disabled={isPending}>
              <MessageSquare size={16} strokeWidth={1.5} />
              Ask a question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask a question</DialogTitle>
              <DialogDescription>
                Your message will be emailed to the team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="question-text">Your question</Label>
              <Textarea
                id="question-text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question here…"
                rows={4}
                maxLength={2000}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setQuestionOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleQuestion}
                disabled={isPending || questionText.trim().length === 0}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
