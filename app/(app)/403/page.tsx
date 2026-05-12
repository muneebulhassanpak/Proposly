import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-5xl font-semibold text-ink-faint tabular-nums">
        403
      </p>
      <h1 className="mt-4 text-lg font-semibold text-ink">Access denied</h1>
      <p className="mt-2 text-sm text-ink-mute">
        You don&apos;t have permission to view this page.
      </p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}
