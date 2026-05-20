export default function ManagerDashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded-sm bg-hairline" />
          <div className="h-3.5 w-64 rounded-sm bg-hairline" />
        </div>
        <div className="h-8 w-32 rounded-[6px] bg-hairline" />
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-hairline bg-surface p-4"
          >
            <div className="mb-2 h-3 w-20 rounded-sm bg-hairline" />
            <div className="h-6 w-16 rounded-sm bg-hairline" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-9 w-48 rounded-[6px] bg-hairline" />
        <div className="h-9 w-44 rounded-[6px] bg-hairline" />
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-hairline bg-surface">
        <div className="h-10 w-full border-b border-hairline bg-hairline/40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full border-b border-hairline" />
        ))}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-3.5 w-32 rounded-sm bg-hairline" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-[6px] bg-hairline" />
            <div className="h-8 w-8 rounded-[6px] bg-hairline" />
          </div>
        </div>
      </div>
    </div>
  )
}
