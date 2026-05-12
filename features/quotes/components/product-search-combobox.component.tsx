"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { searchProductsAction } from "../actions/save-draft.action"
import type { ProductSearchResult } from "../quotes.types"

interface ProductSearchComboboxProps {
  onSelect: (product: ProductSearchResult) => void
}

export function ProductSearchCombobox({
  onSelect,
}: ProductSearchComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  const { data: products = [] } = useQuery({
    queryKey: ["products-search", debouncedSearch],
    queryFn: () => searchProductsAction(debouncedSearch),
    staleTime: 30_000,
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-[6px] border border-dashed border-hairline px-3 text-sm text-ink-mute transition-colors hover:border-accent hover:text-ink"
          onClick={() => setOpen(true)}
        >
          <Search size={14} strokeWidth={1.5} />
          Search catalog…
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type product name…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-sm text-ink-mute">
              No products found.
            </CommandEmpty>
            {products.length > 0 && (
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={() => {
                      onSelect(product)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="truncate text-xs text-ink-mute">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-xs text-ink-mute tabular-nums">
                      {Number(product.unit_price).toLocaleString()}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
