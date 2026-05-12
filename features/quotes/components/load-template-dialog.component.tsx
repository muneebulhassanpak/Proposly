"use client"

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
import { useLoadTemplateDialog } from "../hooks/use-load-template-dialog.hook"
import type { LineItemRow } from "../quotes.types"

interface LoadTemplateDialogProps {
  hasItems: boolean
  onLoad: (items: LineItemRow[]) => void
}

export function LoadTemplateDialog({
  hasItems,
  onLoad,
}: LoadTemplateDialogProps) {
  const {
    open,
    handleOpenChange,
    selected,
    setSelected,
    confirmClear,
    templates,
    isLoading,
    handleLoad,
  } = useLoadTemplateDialog(hasItems, onLoad)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
