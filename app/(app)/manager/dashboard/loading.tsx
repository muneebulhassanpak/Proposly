import { Skeleton } from "@/components/ui/skeleton"

export default function ManagerDashboardLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-8 w-32 rounded-[6px]" />
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-hairline bg-surface p-4"
          >
            <Skeleton className="mb-2 h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-9 w-48 rounded-[6px]" />
        <Skeleton className="h-9 w-44 rounded-[6px]" />
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-hairline bg-surface">
        <Skeleton className="h-10 w-full rounded-none border-b border-hairline opacity-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full border-b border-hairline" />
        ))}
        <div className="flex items-center justify-between px-4 py-3">
          <Skeleton className="h-3.5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-[6px]" />
            <Skeleton className="h-8 w-8 rounded-[6px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
