export default function ApprovalDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back link */}
      <div className="mb-4 h-4 w-32 rounded-sm bg-hairline" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded-sm bg-hairline" />
          <div className="h-3.5 w-36 rounded-sm bg-hairline" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-[6px] bg-hairline" />
          <div className="h-8 w-24 rounded-[6px] bg-hairline" />
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left — line items */}
        <div className="rounded-[10px] border border-hairline bg-surface p-6">
          <div className="mb-4 h-4 w-24 rounded-sm bg-hairline" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-full rounded-sm bg-hairline" />
            ))}
          </div>
          {/* Totals */}
          <div className="mt-6 space-y-2 border-t border-hairline pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3.5 w-16 rounded-sm bg-hairline" />
                <div className="h-3.5 w-20 rounded-sm bg-hairline" />
              </div>
            ))}
          </div>
        </div>

        {/* Right — details + margin */}
        <div className="space-y-4">
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <div className="mb-4 h-4 w-16 rounded-sm bg-hairline" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-14 rounded-sm bg-hairline" />
                  <div className="h-3.5 w-full rounded-sm bg-hairline" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-hairline bg-surface p-5">
            <div className="mb-3 h-4 w-32 rounded-sm bg-hairline" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3.5 w-20 rounded-sm bg-hairline" />
                  <div className="h-3.5 w-16 rounded-sm bg-hairline" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
