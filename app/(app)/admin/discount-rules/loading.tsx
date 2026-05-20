import { Skeleton } from "@/components/ui/skeleton"

export default function DiscountRulesLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3.5 w-56" />
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3.5 w-48" />
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="rounded-[10px] border border-hairline bg-surface p-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-9 w-32 rounded-[6px]" />
            </div>
            <Skeleton className="h-8 w-24 rounded-[6px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
