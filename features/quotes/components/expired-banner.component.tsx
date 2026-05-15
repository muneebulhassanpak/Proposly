import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ExpiredBannerProps {
  expiresAt: string
  onExtend: () => void
}

export function ExpiredBanner({ expiresAt, onExtend }: ExpiredBannerProps) {
  const expiryDate = new Date(expiresAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-amber/20 bg-amber/5 px-4 py-3">
      <AlertTriangle
        size={16}
        strokeWidth={1.5}
        className="shrink-0 text-amber"
      />
      <p className="flex-1 text-sm text-ink">
        This quote expired on {expiryDate}.
      </p>
      <Button size="sm" variant="outline" onClick={onExtend}>
        Extend expiry
      </Button>
    </div>
  )
}
