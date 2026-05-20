import { Skeleton } from "@/components/ui/skeleton"

export default function NewQuoteLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3.5 w-52" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-[6px]" />
          <Skeleton className="h-8 w-28 rounded-[6px]" />
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left — details + line items */}
        <div className="space-y-6">
          <div className="rounded-[10px] border border-hairline bg-surface p-6">
            <Skeleton className="mb-4 h-4 w-24" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-9 w-full rounded-[6px]" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-hairline bg-surface p-6">
            <Skeleton className="mb-4 h-4 w-20" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Right — totals */}
        <div className="space-y-4">
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <Skeleton className="mb-4 h-4 w-14" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <Skeleton className="mb-3 h-3 w-36" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
