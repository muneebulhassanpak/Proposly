"use client"

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { LineItemRow } from "../quotes.types"

interface LineItemsTableProps {
  items: LineItemRow[]
  onChange: (items: LineItemRow[]) => void
}

function SortableRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: LineItemRow
  onUpdate: (field: keyof LineItemRow, value: string | number) => void
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.localId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const lineTotal = item.unit_price * item.quantity

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[20px_1fr_140px_80px_80px_80px_32px] items-center gap-2 border-b border-hairline py-2 last:border-0"
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex cursor-grab items-center justify-center text-ink-faint active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} strokeWidth={1.5} />
      </button>

      {/* Name + description */}
      <div className="min-w-0 space-y-1">
        <Input
          value={item.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="Item name"
          className="h-8 text-sm"
        />
        <Input
          value={item.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Description (optional)"
          className="h-7 text-xs text-ink-mute"
        />
      </div>

      {/* Unit price */}
      <Input
        type="number"
        min={0}
        value={item.unit_price === 0 ? "" : item.unit_price}
        onChange={(e) =>
          onUpdate("unit_price", parseFloat(e.target.value) || 0)
        }
        placeholder="0.00"
        className="h-8 text-right font-mono text-sm tabular-nums"
      />

      {/* Qty */}
      <Input
        type="number"
        min={0.001}
        step="any"
        value={item.quantity === 1 ? "1" : item.quantity}
        onChange={(e) => onUpdate("quantity", parseFloat(e.target.value) || 1)}
        className="h-8 text-right font-mono text-sm tabular-nums"
      />

      {/* Unit (read-only display) */}
      <div className="truncate text-right text-sm text-ink-mute capitalize">
        {item.unit || "item"}
      </div>

      {/* Line total */}
      <div className="text-right font-mono text-sm text-ink tabular-nums">
        {lineTotal.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center text-ink-mute transition-colors hover:text-crimson"
        aria-label="Remove item"
      >
        <Trash2 size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export function LineItemsTable({ items, onChange }: LineItemsTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.localId === active.id)
    const newIndex = items.findIndex((i) => i.localId === over.id)
    const next = [...items]
    const [moved] = next.splice(oldIndex, 1)
    next.splice(newIndex, 0, moved)
    onChange(next.map((item, idx) => ({ ...item, sort_order: idx })))
  }

  function updateItem(
    localId: string,
    field: keyof LineItemRow,
    value: string | number
  ) {
    onChange(
      items.map((item) =>
        item.localId === localId ? { ...item, [field]: value } : item
      )
    )
  }

  function removeItem(localId: string) {
    onChange(items.filter((item) => item.localId !== localId))
  }

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-ink-mute">
        No items yet. Search the catalog or add a custom item.
      </p>
    )
  }

  return (
    <div>
      {/* Column headers */}
      <div className="grid grid-cols-[20px_1fr_140px_80px_80px_80px_32px] gap-2 border-b border-hairline pb-2 text-xs text-ink-mute">
        <div />
        <div>Item</div>
        <div className="text-right">Unit price</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Unit</div>
        <div className="text-right">Total</div>
        <div />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.localId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableRow
              key={item.localId}
              item={item}
              onUpdate={(field, value) =>
                updateItem(item.localId, field, value)
              }
              onRemove={() => removeItem(item.localId)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
