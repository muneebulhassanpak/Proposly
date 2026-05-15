"use client"

import Link from "next/link"
import { Controller } from "react-hook-form"
import { AlertTriangle, ArrowLeft, Eye, Plus } from "lucide-react"

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
import { ROUTES } from "@/lib/constants/routes.constants"
import { useQuoteBuilder } from "../hooks/use-quote-builder.hook"
import { ClientCombobox } from "../components/client-combobox.component"
import { LineItemsTable } from "../components/line-items-table.component"
import { LoadTemplateDialog } from "../components/load-template-dialog.component"
import { ProductSearchCombobox } from "../components/product-search-combobox.component"
import { formatMoney } from "../utils/quote.utils"
import type { InitialQuoteData } from "../quotes.types"

interface QuoteBuilderPageProps {
  defaultTaxPercent: number
  discountThreshold: number | null
  currency: string
  quoteId?: string
  initial?: InitialQuoteData
}

export function QuoteBuilderPage({
  defaultTaxPercent,
  discountThreshold,
  currency,
  quoteId,
  initial,
}: QuoteBuilderPageProps) {
  const {
    form,
    onSubmit,
    isSaving,
    selectedClient,
    setSelectedClient,
    watchedTitle,
    lineItems,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    totalCost,
    grossMarginPercent,
    exceedsThreshold,
    addProductItem,
    addCustomItem,
    sendForApproval,
    isSendingForApproval,
  } = useQuoteBuilder({
    quoteId,
    initial,
    defaultTaxPercent,
    discountThreshold,
  })

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form

  const isNew = !quoteId
  const pageTitle = isNew ? "New Quote" : watchedTitle || "Edit Quote"

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href={ROUTES.DASHBOARD}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to Dashboard
        </Link>
      </Button>

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
          {quoteId ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.QUOTE_PREVIEW(quoteId)}>
                <Eye size={14} strokeWidth={1.5} />
                Preview
              </Link>
            </Button>
          ) : (
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
          )}
          <Button type="submit" size="sm" loading={isSaving}>
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

              <div className="grid grid-cols-2 gap-4">
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
                        className="w-full"
                        disablePast
                      />
                    )}
                  />
                </div>
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
                <LineItemsTable
                  items={field.value}
                  onChange={field.onChange}
                  currency={currency}
                />
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
                  {formatMoney(subtotal, currency)}
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
                    −{formatMoney(discountAmount, currency)}
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
                    +{formatMoney(taxAmount, currency)}
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
                    {formatMoney(total, currency)}
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
                  {formatMoney(totalCost, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-mute">Revenue</span>
                <span className="font-mono text-ink tabular-nums">
                  {formatMoney(total, currency)}
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

          {/* Send for approval */}
          {exceedsThreshold && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              loading={isSendingForApproval}
              disabled={lineItems.length === 0}
              onClick={sendForApproval}
            >
              Send for Approval
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
