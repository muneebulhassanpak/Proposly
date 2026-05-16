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
import { DEFAULT_PRODUCT_UNIT } from "@/lib/constants/product.constants"
import type { LineItemRow } from "../quotes.types"

interface LineItemsTableProps {
  items: LineItemRow[]
  onChange: (items: LineItemRow[]) => void
  currency: string
}

function SortableRow({
  item,
  onUpdate,
  onRemove,
  currency,
}: {
  item: LineItemRow
  onUpdate: (field: keyof LineItemRow, value: string | number) => void
  onRemove: () => void
  currency: string
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

  const formattedTotal = lineTotal.toLocaleString(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const unitPriceDisplay = item.unit_price.toLocaleString(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-b border-hairline py-2 last:border-0"
    >
      {/* Desktop layout */}
      <div className="hidden grid-cols-[20px_minmax(0,400px)_1fr_80px_130px_32px] items-center gap-2 sm:grid">
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
          {item.product_id ? (
            <div className="h-8 truncate rounded-[6px] bg-paper px-3 text-sm leading-8 text-ink">
              {item.name}
            </div>
          ) : (
            <Input
              value={item.name}
              onChange={(e) => onUpdate("name", e.target.value.slice(0, 100))}
              placeholder="Item name"
              className={`h-8 text-sm${!item.name.trim() ? "border-crimson/50 focus:ring-crimson/40" : ""}`}
            />
          )}
          <Input
            value={item.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            placeholder="Description (optional)"
            className="h-7 text-xs text-ink-mute"
          />
        </div>

        {/* Unit price */}
        {item.product_id ? (
          <div className="flex h-8 items-center justify-end gap-1 rounded-[6px] bg-paper px-3">
            <span className="font-mono text-sm text-ink-mute tabular-nums">
              {unitPriceDisplay}
            </span>
            <span className="text-xs text-ink-mute capitalize">
              / {item.unit || DEFAULT_PRODUCT_UNIT}
            </span>
          </div>
        ) : (
          <div className="flex h-8 items-center gap-1">
            <Input
              type="number"
              min={0.01}
              step="any"
              value={item.unit_price === 0 ? "" : item.unit_price}
              onChange={(e) =>
                onUpdate(
                  "unit_price",
                  Math.max(0, parseFloat(e.target.value) || 0)
                )
              }
              placeholder="0.00"
              className="h-8 min-w-0 flex-1 text-right font-mono text-sm tabular-nums"
            />
            <span className="shrink-0 text-xs text-ink-mute capitalize">
              / {item.unit || DEFAULT_PRODUCT_UNIT}
            </span>
          </div>
        )}

        {/* Qty */}
        <Input
          type="number"
          min={1}
          step={1}
          value={item.quantity}
          onChange={(e) =>
            onUpdate(
              "quantity",
              Math.max(1, Math.floor(Number(e.target.value))) || 1
            )
          }
          className="h-8 text-right font-mono text-sm tabular-nums"
        />

        {/* Line total */}
        <div className="text-right font-mono text-sm text-ink tabular-nums">
          {formattedTotal}
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

      {/* Mobile layout — stacked card */}
      <div className="space-y-2 sm:hidden">
        {/* Top row: drag + name + remove */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex shrink-0 cursor-grab items-center justify-center text-ink-faint active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} strokeWidth={1.5} />
          </button>
          <div className="min-w-0 flex-1">
            {item.product_id ? (
              <div className="h-8 truncate rounded-[6px] bg-paper px-3 text-sm leading-8 text-ink">
                {item.name}
              </div>
            ) : (
              <Input
                value={item.name}
                onChange={(e) => onUpdate("name", e.target.value.slice(0, 100))}
                placeholder="Item name"
                className={`h-8 text-sm${!item.name.trim() ? "border-crimson/50 focus:ring-crimson/40" : ""}`}
              />
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="flex shrink-0 items-center justify-center text-ink-mute transition-colors hover:text-crimson"
            aria-label="Remove item"
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Description */}
        <Input
          value={item.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Description (optional)"
          className="h-7 text-xs text-ink-mute"
        />

        {/* Bottom row: price, qty, total */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-ink-mute uppercase">Price</span>
            {item.product_id ? (
              <div className="mt-0.5 font-mono text-sm text-ink-mute tabular-nums">
                {unitPriceDisplay}
                <span className="text-xs capitalize">
                  {" "}
                  / {item.unit || DEFAULT_PRODUCT_UNIT}
                </span>
              </div>
            ) : (
              <Input
                type="number"
                min={0.01}
                step="any"
                value={item.unit_price === 0 ? "" : item.unit_price}
                onChange={(e) =>
                  onUpdate(
                    "unit_price",
                    Math.max(0, parseFloat(e.target.value) || 0)
                  )
                }
                placeholder="0.00"
                className="mt-0.5 h-7 font-mono text-sm tabular-nums"
              />
            )}
          </div>
          <div>
            <span className="text-[10px] text-ink-mute uppercase">Qty</span>
            <Input
              type="number"
              min={1}
              step={1}
              value={item.quantity}
              onChange={(e) =>
                onUpdate(
                  "quantity",
                  Math.max(1, Math.floor(Number(e.target.value))) || 1
                )
              }
              className="mt-0.5 h-7 font-mono text-sm tabular-nums"
            />
          </div>
          <div>
            <span className="text-[10px] text-ink-mute uppercase">Total</span>
            <div className="mt-0.5 font-mono text-sm leading-7 font-semibold text-ink tabular-nums">
              {formattedTotal}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LineItemsTable({
  items,
  onChange,
  currency,
}: LineItemsTableProps) {
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
      {/* Column headers — desktop only */}
      <div className="hidden grid-cols-[20px_minmax(0,400px)_1fr_80px_130px_32px] gap-2 border-b border-hairline pb-2 text-xs text-ink-mute sm:grid">
        <div />
        <div>Item</div>
        <div className="text-right">Unit price</div>
        <div className="text-right">Qty</div>
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
              currency={currency}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
