"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createProductAction,
  toggleProductActiveAction,
  updateProductAction,
} from "../actions/product.action"
import { getPriceHistory, getProducts } from "../services/product.service"
import type { ProductFormData } from "../schemas/product.schema"

const PRODUCTS_KEY = ["products"] as const

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: getProducts })
}

export function usePriceHistory(productId: string | null) {
  return useQuery({
    queryKey: ["price-history", productId],
    queryFn: () => getPriceHistory(productId!),
    enabled: !!productId,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductFormData) => createProductAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? "Failed to create product")
        return
      }
      toast.success("Product created")
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY })
    },
    onError: () => toast.error("Failed to create product"),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string
      data: ProductFormData
    }) => updateProductAction(productId, data),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? "Failed to update product")
        return
      }
      toast.success("Product updated")
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY })
    },
    onError: () => toast.error("Failed to update product"),
  })
}

export function useToggleProductActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      isActive,
    }: {
      productId: string
      isActive: boolean
    }) => toggleProductActiveAction(productId, isActive),
    onSuccess: (result, variables) => {
      if (!result.success) {
        toast.error(result.error ?? "Failed to update status")
        return
      }
      toast.success(
        variables.isActive ? "Product activated" : "Product deactivated"
      )
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY })
    },
    onError: () => toast.error("Failed to update status"),
  })
}
