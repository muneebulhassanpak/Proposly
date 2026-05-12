export default function DiscountRulesLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="h-5 w-36 rounded-sm bg-hairline" />
        <div className="h-3.5 w-56 rounded-sm bg-hairline" />
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded-sm bg-hairline" />
          <div className="h-3.5 w-48 rounded-sm bg-hairline" />
          <div className="h-3.5 w-40 rounded-sm bg-hairline" />
        </div>
        <div className="rounded-[10px] border border-hairline bg-surface p-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 rounded-sm bg-hairline" />
              <div className="h-9 w-32 rounded-[6px] bg-hairline" />
            </div>
            <div className="h-8 w-24 rounded-[6px] bg-hairline" />
          </div>
        </div>
      </div>
    </div>
  )
}
