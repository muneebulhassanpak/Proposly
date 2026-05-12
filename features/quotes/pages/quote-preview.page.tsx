"use client"

import { ROUTES } from "@/lib/constants/routes.constants"
import { QUOTE_STATUS } from "../constants/quote.constants"
import { useSendQuote } from "../hooks/use-send-quote.hook"
import { PreviewActionsBar } from "../components/preview-actions-bar.component"
import { formatMoney } from "../utils/quote.utils"
import type { QuotePreviewData } from "../quotes.types"

interface QuotePreviewPageProps {
  quoteData: QuotePreviewData
}

export function QuotePreviewPage({ quoteData }: QuotePreviewPageProps) {
  const { dialogOpen, openDialog, closeDialog, onConfirm, isSending } =
    useSendQuote(quoteData.quoteId)

  const isDraft = quoteData.status === QUOTE_STATUS.DRAFT
  const canSend = isDraft && !!quoteData.clientEmail

  const issuedDate = new Date(quoteData.issuedAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
  const expiryDate = quoteData.expiresAt
    ? new Date(quoteData.expiresAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div>
      <PreviewActionsBar
        editHref={ROUTES.QUOTE(quoteData.quoteId)}
        quoteTitle={quoteData.title}
        clientEmail={quoteData.clientEmail}
        canSend={canSend}
        onSend={openDialog}
        dialogOpen={dialogOpen}
        onDialogClose={closeDialog}
        onDialogConfirm={onConfirm}
        isSending={isSending}
        onPrint={() => window.print()}
      />

      {/* Printable proposal */}
      <div className="mx-auto max-w-[820px] rounded-[10px] border border-hairline bg-surface shadow-sm print:max-w-full print:rounded-none print:border-0 print:shadow-none">
        {/* Branded header */}
        <div
          className="flex items-center justify-between rounded-t-[10px] px-8 py-6 print:rounded-none"
          style={{ backgroundColor: quoteData.companyBrandColor }}
        >
          <div className="flex items-center gap-4">
            {quoteData.companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={quoteData.companyLogoUrl}
                alt={quoteData.companyName}
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-white">
                {quoteData.companyName}
              </span>
            )}
          </div>
          {quoteData.companyAddress && (
            <p className="max-w-[240px] text-right text-xs leading-relaxed text-white/80">
              {quoteData.companyAddress}
            </p>
          )}
        </div>

        <div className="px-8 py-8">
          {/* Quote meta */}
          <div className="mb-8 flex items-start justify-between gap-8">
            <div>
              <h1 className="text-2xl font-semibold text-ink">
                {quoteData.title}
              </h1>
              <p className="mt-1 font-mono text-sm text-ink-mute">
                {quoteData.quoteNumber}
              </p>
            </div>
            <div className="shrink-0 text-right text-sm">
              <div className="space-y-0.5">
                <p className="text-ink-mute">
                  Issued: <span className="text-ink">{issuedDate}</span>
                </p>
                {expiryDate && (
                  <p className="text-ink-mute">
                    Expires: <span className="text-ink">{expiryDate}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client block */}
          {(quoteData.clientName || quoteData.clientCompanyName) && (
            <div className="mb-8">
              <p className="mb-1 text-xs font-medium tracking-wide text-ink-mute uppercase">
                Prepared for
              </p>
              {quoteData.clientName && (
                <p className="font-medium text-ink">{quoteData.clientName}</p>
              )}
              {quoteData.clientCompanyName && (
                <p className="text-sm text-ink-mute">
                  {quoteData.clientCompanyName}
                </p>
              )}
            </div>
          )}

          {/* Line items table */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="pb-2 text-left font-medium text-ink-mute">
                    Item
                  </th>
                  <th className="pb-2 text-right font-medium text-ink-mute">
                    Qty
                  </th>
                  <th className="pb-2 text-right font-medium text-ink-mute">
                    Unit Price
                  </th>
                  <th className="pb-2 text-right font-medium text-ink-mute">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {quoteData.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-ink">{item.name}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-ink-mute">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono text-ink-mute tabular-nums">
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </td>
                    <td className="py-3 text-right font-mono text-ink-mute tabular-nums">
                      {formatMoney(item.unit_price, quoteData.currency)}
                    </td>
                    <td className="py-3 text-right font-mono text-ink tabular-nums">
                      {formatMoney(item.line_total, quoteData.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-mute">Subtotal</span>
              <span className="font-mono text-ink tabular-nums">
                {formatMoney(quoteData.subtotal, quoteData.currency)}
              </span>
            </div>
            {quoteData.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-ink-mute">
                  Discount ({quoteData.discountPercent}%)
                </span>
                <span className="font-mono text-ink-mute tabular-nums">
                  −{formatMoney(quoteData.discountAmount, quoteData.currency)}
                </span>
              </div>
            )}
            {quoteData.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-ink-mute">
                  Tax ({quoteData.taxPercent}%)
                </span>
                <span className="font-mono text-ink-mute tabular-nums">
                  +{formatMoney(quoteData.taxAmount, quoteData.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-hairline pt-2">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-mono text-base font-semibold text-ink tabular-nums">
                {formatMoney(quoteData.total, quoteData.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
