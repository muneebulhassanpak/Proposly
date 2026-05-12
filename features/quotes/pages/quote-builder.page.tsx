"use client"

import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
  quoteBuilderSchema,
  type QuoteBuilderFormData,
} from "../schemas/quote-builder.schema"
import type {
  Client,
  InitialQuoteData,
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

  // selectedClient is display-only state for the combobox label — not a form field
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initial?.client ?? null
  )

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<QuoteBuilderFormData>({
    resolver: zodResolver(quoteBuilderSchema),
    defaultValues: {
      title: initial?.title ?? "",
      client_id: initial?.client_id ?? null,
      expires_at: initial?.expires_at ? new Date(initial.expires_at) : null,
      notes: initial?.notes ?? "",
      line_items: initial?.line_items ?? [],
      discount_percent: initial?.discount_percent ?? 0,
      tax_percent: initial?.tax_percent ?? defaultTaxPercent,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  // Reactive values for computed totals and derived UI state
  const [watchedTitle, lineItems, discountPercent, taxPercent] = useWatch({
    control,
    name: ["title", "line_items", "discount_percent", "tax_percent"],
  })

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  )
  const discountAmount = (subtotal * discountPercent) / 100
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * taxPercent) / 100
  const total = taxableAmount + taxAmount
  const totalCost = lineItems.reduce(
    (sum, item) => sum + (item.cost_price ?? 0) * item.quantity,
    0
  )
  const grossMarginPercent = total > 0 ? ((total - totalCost) / total) * 100 : 0
  const exceedsThreshold =
    discountThreshold !== null && discountPercent > discountThreshold

  const saveDraft = useMutation({
    mutationFn: (data: QuoteBuilderFormData) =>
      saveDraftAction({
        quote_id: quoteId,
        title: data.title,
        client_id: data.client_id,
        expires_at: data.expires_at ? data.expires_at.toISOString() : null,
        notes: data.notes,
        line_items: data.line_items.map((item, i) => ({
          product_id: item.product_id,
          name: item.name,
          description: item.description,
          unit_price: item.unit_price,
          cost_price: item.cost_price,
          quantity: item.quantity,
          unit: item.unit,
          sort_order: i,
        })),
        discount_percent: data.discount_percent,
        tax_percent: data.tax_percent,
      }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Draft saved.")
        if (!quoteId) router.push(`/quotes/${result.quoteId}`)
      } else {
        toast.error(result.error)
      }
    },
  })

  function addProductItem(product: ProductSearchResult) {
    const current = getValues("line_items")
    setValue("line_items", [
      ...current,
      {
        localId: crypto.randomUUID(),
        product_id: product.id,
        name: product.name,
        description: product.description ?? "",
        unit_price: Number(product.unit_price),
        cost_price:
          product.cost_price != null ? Number(product.cost_price) : null,
        quantity: 1,
        unit: product.unit ?? "item",
        sort_order: current.length,
      },
    ])
  }

  function addCustomItem() {
    const current = getValues("line_items")
    setValue("line_items", [
      ...current,
      {
        localId: crypto.randomUUID(),
        product_id: null,
        name: "",
        description: "",
        unit_price: 0,
        cost_price: null,
        quantity: 1,
        unit: "item",
        sort_order: current.length,
      },
    ])
  }

  const isNew = !quoteId
  const pageTitle = isNew ? "New Quote" : watchedTitle || "Edit Quote"

  return (
    <form onSubmit={handleSubmit((data) => saveDraft.mutate(data))} noValidate>
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
            hasItems={lineItems.length > 0}
            onLoad={(templateItems) => setValue("line_items", templateItems)}
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
          <Button type="submit" size="sm" loading={saveDraft.isPending}>
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
                  placeholder="e.g. Brand Identity Package"
                  maxLength={100}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-crimson">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Client</Label>
                <Controller
                  control={control}
                  name="client_id"
                  render={({ field }) => (
                    <ClientCombobox
                      value={field.value}
                      selectedClient={selectedClient}
                      onChange={(id, client) => {
                        field.onChange(id)
                        setSelectedClient(client)
                      }}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Expiry date</Label>
                <Controller
                  control={control}
                  name="expires_at"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="No expiry"
                      className="w-48"
                      disablePast
                    />
                  )}
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
                  placeholder="Add any internal context or instructions…"
                  rows={3}
                  {...register("notes")}
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomItem}
                >
                  <Plus size={14} strokeWidth={1.5} />
                  Custom item
                </Button>
              </div>
            </div>
            <Controller
              control={control}
              name="line_items"
              render={({ field }) => (
                <LineItemsTable items={field.value} onChange={field.onChange} />
              )}
            />
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
                <Controller
                  control={control}
                  name="discount_percent"
                  render={({ field }) => (
                    <Input
                      id="discount-pct"
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      placeholder="0"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          Math.min(
                            100,
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        )
                      }
                      className="h-8 text-right font-mono text-sm tabular-nums"
                    />
                  )}
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
                <Controller
                  control={control}
                  name="tax_percent"
                  render={({ field }) => (
                    <Input
                      id="tax-pct"
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      placeholder="0"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          Math.min(
                            100,
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        )
                      }
                      className="h-8 text-right font-mono text-sm tabular-nums"
                    />
                  )}
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!quoteId}
            >
              Send for Approval
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
