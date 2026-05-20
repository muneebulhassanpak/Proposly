import { Skeleton } from "@/components/ui/skeleton"

export default function ApprovalsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-56" />
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-hairline bg-surface">
        <Skeleton className="h-10 w-full rounded-none border-b border-hairline opacity-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-full border-b border-hairline" />
        ))}
      </div>
    </div>
  )
}
