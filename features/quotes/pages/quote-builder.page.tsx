"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { AlertTriangle, Eye, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { saveDraftAction } from "../actions/save-draft.action"
import { ClientCombobox } from "../components/client-combobox.component"
import { LineItemsTable } from "../components/line-items-table.component"
import { LoadTemplateDialog } from "../components/load-template-dialog.component"
import { ProductSearchCombobox } from "../components/product-search-combobox.component"
import type {
  Client,
  InitialQuoteData,
  LineItemRow,
  ProductSearchResult,
} from "../quotes.types"

interface QuoteBuilderPageProps {
  defaultTaxPercent: number
  discountThreshold: number | null
  quoteId?: string
  initial?: InitialQuoteData
}

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function QuoteBuilderPage({
  defaultTaxPercent,
  discountThreshold,
  quoteId,
  initial,
}: QuoteBuilderPageProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initial?.title ?? "")
  const [clientId, setClientId] = useState<string | null>(
    initial?.client_id ?? null
  )
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initial?.client ?? null
  )
  const [expiresAt, setExpiresAt] = useState<Date | null>(
    initial?.expires_at ? new Date(initial.expires_at) : null
  )
  const [notes, setNotes] = useState(initial?.notes ?? "")
  const [items, setItems] = useState<LineItemRow[]>(initial?.line_items ?? [])
  const [discountPercent, setDiscountPercent] = useState(
    initial?.discount_percent ?? 0
  )
  const [taxPercent, setTaxPercent] = useState(
    initial?.tax_percent ?? defaultTaxPercent
  )

  // Computed totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  )
  const discountAmount = (subtotal * discountPercent) / 100
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * taxPercent) / 100
  const total = taxableAmount + taxAmount

  // Margin
  const totalCost = items.reduce(
    (sum, item) => sum + (item.cost_price ?? 0) * item.quantity,
    0
  )
  const grossMarginPercent = total > 0 ? ((total - totalCost) / total) * 100 : 0

  const exceedsThreshold =
    discountThreshold !== null && discountPercent > discountThreshold

  const saveDraft = useMutation({
    mutationFn: () =>
      saveDraftAction({
        quote_id: quoteId,
        title,
        client_id: clientId,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        notes,
        line_items: items.map((item, i) => ({
          product_id: item.product_id,
          name: item.name,
          description: item.description,
          unit_price: item.unit_price,
          cost_price: item.cost_price,
          quantity: item.quantity,
          unit: item.unit,
          sort_order: i,
        })),
        discount_percent: discountPercent,
        tax_percent: taxPercent,
      }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Draft saved.")
        if (!quoteId) {
          router.push(`/quotes/${result.quoteId}`)
        }
      } else {
        toast.error(result.error)
      }
    },
  })

  function addProductItem(product: ProductSearchResult) {
    const newItem: LineItemRow = {
      localId: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      description: product.description ?? "",
      unit_price: Number(product.unit_price),
      cost_price:
        product.cost_price != null ? Number(product.cost_price) : null,
      quantity: 1,
      unit: product.unit ?? "item",
      sort_order: items.length,
    }
    setItems((prev) => [...prev, newItem])
  }

  function addCustomItem() {
    const newItem: LineItemRow = {
      localId: crypto.randomUUID(),
      product_id: null,
      name: "",
      description: "",
      unit_price: 0,
      cost_price: null,
      quantity: 1,
      unit: "item",
      sort_order: items.length,
    }
    setItems((prev) => [...prev, newItem])
  }

  const isNew = !quoteId
  const pageTitle = isNew ? "New Quote" : title || "Edit Quote"

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">{pageTitle}</h1>
          <p className="mt-1 text-sm text-ink-mute">
            {isNew ? "Build and save a draft quote." : "Edit this draft quote."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LoadTemplateDialog
            hasItems={items.length > 0}
            onLoad={(templateItems) => setItems(templateItems)}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" size="sm" disabled>
                  <Eye size={14} strokeWidth={1.5} />
                  Preview
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Save first to preview</TooltipContent>
          </Tooltip>
          <Button
            size="sm"
            loading={saveDraft.isPending}
            onClick={() => saveDraft.mutate()}
          >
            Save as Draft
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* ── Left column ── */}
        <div className="space-y-6">
          {/* Quote details */}
          <div className="rounded-[10px] border border-hairline bg-surface p-6">
            <h2 className="mb-4 text-sm font-medium text-ink">Quote details</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="quote-title">Title</Label>
                <Input
                  id="quote-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Brand Identity Package"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Client</Label>
                <ClientCombobox
                  value={clientId}
                  selectedClient={selectedClient}
                  onChange={(id, client) => {
                    setClientId(id)
                    setSelectedClient(client)
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Expiry date</Label>
                <DatePicker
                  value={expiresAt}
                  onChange={setExpiresAt}
                  placeholder="No expiry"
                  className="w-48"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="quote-notes">
                  Internal notes
                  <span className="ml-1.5 text-xs font-normal text-ink-mute">
                    Not shown to client
                  </span>
                </Label>
                <Textarea
                  id="quote-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any internal context or instructions…"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="rounded-[10px] border border-hairline bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-ink">Line items</h2>
              <div className="flex items-center gap-2">
                <ProductSearchCombobox onSelect={addProductItem} />
                <Button variant="outline" size="sm" onClick={addCustomItem}>
                  <Plus size={14} strokeWidth={1.5} />
                  Custom item
                </Button>
              </div>
            </div>

            <LineItemsTable items={items} onChange={setItems} />
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {/* Totals panel */}
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <h2 className="mb-4 text-sm font-medium text-ink">Totals</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-mute">Subtotal</span>
                <span className="font-mono text-ink tabular-nums">
                  {formatMoney(subtotal)}
                </span>
              </div>

              {/* Discount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="discount-pct"
                    className="font-normal text-ink-mute"
                  >
                    Discount %
                  </Label>
                  <span className="font-mono text-xs text-ink-mute tabular-nums">
                    −{formatMoney(discountAmount)}
                  </span>
                </div>
                <Input
                  id="discount-pct"
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={discountPercent === 0 ? "" : discountPercent}
                  onChange={(e) =>
                    setDiscountPercent(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="h-8 text-right font-mono text-sm tabular-nums"
                />
              </div>

              {/* Tax */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="tax-pct"
                    className="font-normal text-ink-mute"
                  >
                    Tax %
                  </Label>
                  <span className="font-mono text-xs text-ink-mute tabular-nums">
                    +{formatMoney(taxAmount)}
                  </span>
                </div>
                <Input
                  id="tax-pct"
                  type="number"
                  min={0}
                  max={100}
                  step="any"
                  value={taxPercent === 0 ? "" : taxPercent}
                  onChange={(e) =>
                    setTaxPercent(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="h-8 text-right font-mono text-sm tabular-nums"
                />
              </div>

              <div className="border-t border-hairline pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">Total</span>
                  <span className="font-mono text-base font-semibold text-ink tabular-nums">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Approval warning */}
          {exceedsThreshold && (
            <div className="flex items-start gap-2.5 rounded-[10px] border border-amber/30 bg-amber/10 px-4 py-3">
              <AlertTriangle
                size={16}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-amber"
              />
              <p className="text-sm text-amber">
                This discount requires manager approval before sending.
              </p>
            </div>
          )}

          {/* Margin summary */}
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <p className="mb-3 text-xs font-medium tracking-wide text-ink-mute uppercase">
              Internal — not shown to client
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-mute">Total cost</span>
                <span className="font-mono text-ink-mute tabular-nums">
                  {formatMoney(totalCost)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-mute">Revenue</span>
                <span className="font-mono text-ink tabular-nums">
                  {formatMoney(total)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-hairline pt-2">
                <span className="font-medium text-ink">Gross margin</span>
                <span
                  className={`font-mono font-medium tabular-nums ${
                    grossMarginPercent >= 30
                      ? "text-moss"
                      : grossMarginPercent >= 10
                        ? "text-amber"
                        : "text-crimson"
                  }`}
                >
                  {grossMarginPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Send for approval — only shown when discount exceeds threshold */}
          {exceedsThreshold && (
            <Button variant="outline" className="w-full" disabled={!quoteId}>
              Send for Approval
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
