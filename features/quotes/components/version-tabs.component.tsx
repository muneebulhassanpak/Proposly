import { Archive, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { VERSION_STATUS } from "@/lib/constants/quote.constants"
import type { QuoteDetailVersion } from "../quotes.types"
import { VersionSummary } from "./version-summary.component"

type VersionChipVariant = "slate" | "amber" | "cobalt" | "moss"

function getVersionChip(
  status: string
): { label: string; variant: VersionChipVariant } | null {
  switch (status) {
    case VERSION_STATUS.ACTIVE:
      return { label: "Active", variant: "cobalt" }
    case VERSION_STATUS.SUPERSEDED:
      return { label: "Superseded", variant: "slate" }
    case VERSION_STATUS.ARCHIVED:
      return { label: "Archived", variant: "slate" }
    default:
      return null
  }
}

interface VersionTabsProps {
  versions: QuoteDetailVersion[]
  selectedVersionId: string | null
  onSelectVersion: (id: string) => void
  currency: string
  onArchive: (versionId: string) => void
}

export function VersionTabs({
  versions,
  selectedVersionId,
  onSelectVersion,
  currency,
  onArchive,
}: VersionTabsProps) {
  if (versions.length === 0) return null

  const activeTabId = selectedVersionId ?? versions[versions.length - 1]?.id

  return (
    <Tabs value={activeTabId ?? ""} onValueChange={onSelectVersion}>
      <div className="flex items-center gap-2">
        <TabsList variant="line" className="border-b border-hairline pb-0">
          {versions.map((v) => {
            const chip = getVersionChip(v.status)
            return (
              <TabsTrigger key={v.id} value={v.id} className="gap-2 pb-2">
                <span>V{v.versionNumber}</span>
                {chip && (
                  <Badge
                    variant={chip.variant}
                    className="text-[10px] leading-none"
                  >
                    {chip.label}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>

      {versions.map((v) => (
        <TabsContent key={v.id} value={v.id}>
          <div className="flex items-start justify-between pt-4">
            <VersionSummary version={v} currency={currency} />
            {v.status !== VERSION_STATUS.DRAFT &&
              v.status !== VERSION_STATUS.ARCHIVED && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal size={14} strokeWidth={1.5} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onArchive(v.id)}>
                      <Archive size={14} strokeWidth={1.5} />
                      Archive version
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
