import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

interface DataTableSortableHeaderProps<TData> {
  column: Column<TData>
  label: string
}

export function DataTableSortableHeader<TData>({
  column,
  label,
}: DataTableSortableHeaderProps<TData>) {
  const sorted = column.getIsSorted()
  return (
    <button
      type="button"
      className="-ml-2 inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-xs font-medium tracking-wide text-ink-mute uppercase hover:text-ink"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp size={14} strokeWidth={1.5} />
      ) : sorted === "desc" ? (
        <ArrowDown size={14} strokeWidth={1.5} />
      ) : (
        <ArrowUpDown size={14} strokeWidth={1.5} className="opacity-40" />
      )}
    </button>
  )
}
