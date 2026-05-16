"use client"

import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { searchProductsAction } from "../actions/save-draft.action"

export function useProductSearch() {
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

  const { data: products = [], isFetching } = useQuery({
    queryKey: ["products-search", debouncedSearch],
    queryFn: () => searchProductsAction(debouncedSearch),
    staleTime: 30_000,
  })

  const isSearching = isFetching || search !== debouncedSearch

  return { open, setOpen, search, setSearch, products, isSearching }
}
