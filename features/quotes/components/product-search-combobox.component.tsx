"use client"

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
import { useProductSearch } from "../hooks/use-product-search.hook"
import type { ProductSearchResult } from "../quotes.types"

interface ProductSearchComboboxProps {
  onSelect: (product: ProductSearchResult) => void
  currency: string
}

export function ProductSearchCombobox({
  onSelect,
  currency,
}: ProductSearchComboboxProps) {
  const { open, setOpen, search, setSearch, products, isSearching } =
    useProductSearch()

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
      <PopoverContent
        className="w-[calc(100vw-2rem)] p-0 xs:w-96"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type product name…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-sm text-ink-mute">
              {isSearching ? "Searching..." : "No products found."}
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
                      {Number(product.unit_price).toLocaleString(undefined, {
                        style: "currency",
                        currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
