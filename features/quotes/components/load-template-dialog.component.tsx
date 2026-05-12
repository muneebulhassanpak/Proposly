"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { LayoutTemplate } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getQuoteTemplatesAction } from "../actions/save-draft.action"
import type { LineItemRow } from "../quotes.types"

interface LoadTemplateDialogProps {
  hasItems: boolean
  onLoad: (items: LineItemRow[]) => void
}

export function LoadTemplateDialog({
  hasItems,
  onLoad,
}: LoadTemplateDialogProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["quote-templates"],
    queryFn: getQuoteTemplatesAction,
    enabled: open,
    staleTime: 60_000,
  })

  function handleLoad() {
    if (hasItems && !confirmClear) {
      setConfirmClear(true)
      return
    }
    // Templates have no items yet (Sprint 09 builds templates)
    // Just close for now — items will be empty
    onLoad([])
    setOpen(false)
    setSelected(null)
    setConfirmClear(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          setSelected(null)
          setConfirmClear(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutTemplate size={14} strokeWidth={1.5} />
          Load template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Load from template</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {isLoading ? (
            <p className="text-sm text-ink-mute">Loading templates…</p>
          ) : templates.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-mute">
              No templates yet.
            </p>
          ) : (
            <div className="space-y-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t.id)}
                  className={`w-full rounded-[6px] px-3 py-2 text-left text-sm transition-colors hover:bg-paper ${
                    selected === t.id ? "bg-accent/10 text-accent" : "text-ink"
                  }`}
                >
                  {t.name}
                  {t.description && (
                    <p className="mt-0.5 text-xs text-ink-mute">
                      {t.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}

          {confirmClear && (
            <p className="mt-3 rounded-[6px] bg-amber/10 px-3 py-2 text-sm text-amber">
              This will replace your current line items. Continue?
            </p>
          )}
        </div>

        <DialogFooter showCloseButton>
          <Button
            onClick={handleLoad}
            disabled={templates.length > 0 && !selected}
          >
            {confirmClear ? "Yes, replace items" : "Load"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
