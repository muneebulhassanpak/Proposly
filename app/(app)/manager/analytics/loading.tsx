import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3.5 w-52" />
        </div>
        <Skeleton className="h-9 w-40 rounded-[6px]" />
      </div>

      {/* Metric cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-hairline bg-surface p-4"
          >
            <Skeleton className="mb-2 h-3 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-hairline bg-surface p-5"
          >
            <Skeleton className="mb-4 h-4 w-36" />
            <Skeleton className="h-[260px] w-full opacity-50" />
          </div>
        ))}
      </div>
    </div>
  )
}
