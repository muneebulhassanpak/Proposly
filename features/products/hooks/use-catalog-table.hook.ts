"use client"

import { useMemo } from "react"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { getCatalogColumns } from "../components/catalog-columns.component"
import { useCatalogFilters, useToggleProductActive } from "./use-products.hook"

export function useCatalogTable() {
  const toggleActive = useToggleProductActive()
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sorting,
    setSorting,
    sheetOpen,
    setSheetOpen,
    editProduct,
    setEditProduct,
    filtered,
    isLoading,
    totalCount,
  } = useCatalogFilters()

  const columns = useMemo(
    () =>
      getCatalogColumns({
        onEdit: (product) => {
          setEditProduct(product)
          setSheetOpen(true)
        },
        onToggleActive: (productId, isActive) =>
          toggleActive.mutate({ productId, isActive }),
      }),
    [toggleActive, setEditProduct, setSheetOpen]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  })

  return {
    table,
    columns,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    totalCount,
    isLoading,
    sheetOpen,
    setSheetOpen,
    editProduct,
    setEditProduct,
  }
}
