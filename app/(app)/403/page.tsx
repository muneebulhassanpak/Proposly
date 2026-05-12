import Link from "next/link"
import { ShieldX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants/routes.constants"

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center text-center">
      <ShieldX size={40} strokeWidth={1.5} className="text-ink-faint" />
      <p className="mt-4 font-mono text-4xl font-semibold text-ink tabular-nums">
        403
      </p>
      <h1 className="mt-3 text-lg font-semibold text-ink">Access denied</h1>
      <p className="mt-1 text-sm text-ink-mute">
        You don&apos;t have permission to view this page.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-6">
        <Link href={ROUTES.DASHBOARD}>Back to dashboard</Link>
      </Button>
    </div>
  )
}
