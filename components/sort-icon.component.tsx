import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

export function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc")
    return <ArrowUp size={12} strokeWidth={1.5} className="shrink-0" />
  if (direction === "desc")
    return <ArrowDown size={12} strokeWidth={1.5} className="shrink-0" />
  return (
    <ChevronsUpDown
      size={12}
      strokeWidth={1.5}
      className="shrink-0 text-ink-faint"
    />
  )
}
