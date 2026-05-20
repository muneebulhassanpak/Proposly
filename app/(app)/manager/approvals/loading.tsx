export default function ApprovalsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="h-5 w-40 rounded-sm bg-hairline" />
        <div className="h-3.5 w-56 rounded-sm bg-hairline" />
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-hairline bg-surface">
        <div className="h-10 w-full border-b border-hairline bg-hairline/40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-full border-b border-hairline" />
        ))}
      </div>
    </div>
  )
}
