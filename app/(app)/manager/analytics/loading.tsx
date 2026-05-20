export default function AnalyticsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-28 rounded-sm bg-hairline" />
          <div className="h-3.5 w-52 rounded-sm bg-hairline" />
        </div>
        <div className="h-9 w-40 rounded-[6px] bg-hairline" />
      </div>

      {/* Metric cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-hairline bg-surface p-4"
          >
            <div className="mb-2 h-3 w-24 rounded-sm bg-hairline" />
            <div className="h-7 w-20 rounded-sm bg-hairline" />
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
            <div className="mb-4 h-4 w-36 rounded-sm bg-hairline" />
            <div className="h-[260px] w-full rounded-sm bg-hairline/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
