import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center text-center">
      <FileQuestion size={40} strokeWidth={1.5} className="text-ink-faint" />
      <p className="mt-4 font-mono text-4xl font-semibold text-ink tabular-nums">
        404
      </p>
      <h1 className="mt-3 text-lg font-semibold text-ink">Page not found</h1>
      <p className="mt-1 text-sm text-ink-mute">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-6">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
