import { Skeleton } from "@/components/ui/skeleton"

export default function QuotePreviewLoading() {
  return (
    <div className="mx-auto max-w-[820px]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-[6px]" />
          <Skeleton className="h-8 w-24 rounded-[6px]" />
        </div>
      </div>

      {/* Proposal card */}
      <div className="rounded-[10px] border border-hairline bg-surface p-8">
        <div className="mb-8 space-y-2 text-center">
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="mx-auto h-3.5 w-32" />
        </div>

        {/* Details */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ))}
        </div>

        {/* Line items */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2 border-t border-hairline pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-end gap-8">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
