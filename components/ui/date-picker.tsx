"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  disablePast?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
  disablePast,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-[6px] border border-hairline bg-surface px-3 text-sm transition-colors hover:bg-paper focus:ring-2 focus:ring-primary/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-ink-mute",
            className
          )}
        >
          <span className="truncate">
            {value ? format(value, "dd MMM yyyy") : placeholder}
          </span>
          <CalendarIcon
            size={14}
            strokeWidth={1.5}
            className="shrink-0 text-ink-mute"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(day) => onChange(day ?? null)}
          disabled={disablePast ? { before: new Date() } : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
