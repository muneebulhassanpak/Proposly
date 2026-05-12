export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-40 rounded-sm bg-hairline" />
          <div className="h-3.5 w-64 rounded-sm bg-hairline" />
        </div>
        <div className="h-8 w-28 rounded-[6px] bg-hairline" />
      </div>

      {/* Sections */}
      <div className="divide-y divide-hairline">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr]"
          >
            <div className="space-y-2">
              <div className="h-4 w-24 rounded-sm bg-hairline" />
              <div className="h-3.5 w-48 rounded-sm bg-hairline" />
            </div>
            <div className="rounded-[10px] border border-hairline bg-surface p-6">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1.5">
                    <div className="h-3.5 w-20 rounded-sm bg-hairline" />
                    <div className="h-9 w-full rounded-[6px] bg-hairline" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
