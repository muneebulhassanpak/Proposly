export default function AppLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Page header */}
      <div className="space-y-2">
        <div className="h-5 w-48 rounded-sm bg-hairline" />
        <div className="h-3.5 w-72 rounded-sm bg-hairline" />
      </div>

      {/* Content rows */}
      <div className="mt-6 space-y-3">
        <div className="h-10 w-full rounded-sm bg-hairline" />
        <div className="h-10 w-full rounded-sm bg-hairline" />
        <div className="h-10 w-4/5 rounded-sm bg-hairline" />
        <div className="h-10 w-full rounded-sm bg-hairline" />
        <div className="h-10 w-3/4 rounded-sm bg-hairline" />
      </div>
    </div>
  )
}
