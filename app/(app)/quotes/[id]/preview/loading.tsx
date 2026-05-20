export default function QuotePreviewLoading() {
  return (
    <div className="mx-auto max-w-[820px] animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-28 rounded-sm bg-hairline" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-[6px] bg-hairline" />
          <div className="h-8 w-24 rounded-[6px] bg-hairline" />
        </div>
      </div>

      {/* Proposal card */}
      <div className="rounded-[10px] border border-hairline bg-surface p-8">
        <div className="mb-8 space-y-2 text-center">
          <div className="mx-auto h-6 w-48 rounded-sm bg-hairline" />
          <div className="mx-auto h-3.5 w-32 rounded-sm bg-hairline" />
        </div>

        {/* Details */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 rounded-sm bg-hairline" />
              <div className="h-3.5 w-32 rounded-sm bg-hairline" />
            </div>
          ))}
        </div>

        {/* Line items */}
        <div className="space-y-3">
          <div className="h-10 w-full rounded-sm bg-hairline" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded-sm bg-hairline" />
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2 border-t border-hairline pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-end gap-8">
              <div className="h-3.5 w-16 rounded-sm bg-hairline" />
              <div className="h-3.5 w-20 rounded-sm bg-hairline" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
