"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { ROUTES } from "@/lib/constants/routes.constants"
import { saveDraftAction } from "../actions/save-draft.action"
import {
  quoteBuilderSchema,
  type QuoteBuilderFormData,
} from "../schemas/quote-builder.schema"
import type {
  Client,
  InitialQuoteData,
  ProductSearchResult,
} from "../quotes.types"

interface UseQuoteBuilderParams {
  quoteId?: string
  initial?: InitialQuoteData
  defaultTaxPercent: number
  discountThreshold: number | null
  currency: string
}

export function useQuoteBuilder({
  quoteId,
  initial,
  defaultTaxPercent,
  discountThreshold,
  currency,
}: UseQuoteBuilderParams) {
  const router = useRouter()

  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initial?.client ?? null
  )

  const form = useForm<QuoteBuilderFormData>({
    resolver: zodResolver(quoteBuilderSchema),
    defaultValues: {
      title: initial?.title ?? "",
      client_id: initial?.client_id ?? null,
      expires_at: initial?.expires_at ? new Date(initial.expires_at) : null,
      notes: initial?.notes ?? "",
      line_items: initial?.line_items ?? [],
      discount_percent: initial?.discount_percent ?? 0,
      tax_percent: initial?.tax_percent ?? defaultTaxPercent,
    },
    mode: "onChange",
  })

  const { getValues, setValue, handleSubmit } = form

  const [watchedTitle, lineItems, discountPercent, taxPercent] = useWatch({
    control: form.control,
    name: ["title", "line_items", "discount_percent", "tax_percent"],
  })

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  )
  const discountAmount = (subtotal * discountPercent) / 100
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * taxPercent) / 100
  const total = taxableAmount + taxAmount
  const totalCost = lineItems.reduce(
    (sum, item) => sum + (item.cost_price ?? 0) * item.quantity,
    0
  )
  const grossMarginPercent = total > 0 ? ((total - totalCost) / total) * 100 : 0
  const exceedsThreshold =
    discountThreshold !== null && discountPercent > discountThreshold

  const saveDraft = useMutation({
    mutationFn: (data: QuoteBuilderFormData) =>
      saveDraftAction({
        quote_id: quoteId,
        title: data.title,
        client_id: data.client_id,
        expires_at: data.expires_at ? data.expires_at.toISOString() : null,
        notes: data.notes,
        line_items: data.line_items.map((item, i) => ({
          product_id: item.product_id,
          name: item.name,
          description: item.description,
          unit_price: item.unit_price,
          cost_price: item.cost_price,
          quantity: item.quantity,
          unit: item.unit,
          sort_order: i,
        })),
        discount_percent: data.discount_percent,
        tax_percent: data.tax_percent,
      }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Draft saved.")
        if (!quoteId) router.push(ROUTES.QUOTE(result.quoteId))
      } else {
        toast.error(result.error)
      }
    },
  })

  const onSubmit = handleSubmit((data) => saveDraft.mutate(data))

  function addProductItem(product: ProductSearchResult) {
    const current = getValues("line_items")
    const existing = current.findIndex((i) => i.product_id === product.id)
    if (existing !== -1) {
      setValue(
        "line_items",
        current.map((item, idx) =>
          idx === existing ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
      return
    }
    setValue("line_items", [
      ...current,
      {
        localId: crypto.randomUUID(),
        product_id: product.id,
        name: product.name,
        description: product.description ?? "",
        unit_price: Number(product.unit_price),
        cost_price:
          product.cost_price != null ? Number(product.cost_price) : null,
        quantity: 1,
        unit: product.unit ?? "item",
        sort_order: current.length,
      },
    ])
  }

  function addCustomItem() {
    const current = getValues("line_items")
    setValue("line_items", [
      ...current,
      {
        localId: crypto.randomUUID(),
        product_id: null,
        name: "",
        description: "",
        unit_price: 0,
        cost_price: null,
        quantity: 1,
        unit: "item",
        sort_order: current.length,
      },
    ])
  }

  return {
    form,
    onSubmit,
    isSaving: saveDraft.isPending,
    selectedClient,
    setSelectedClient,
    watchedTitle,
    lineItems,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    totalCost,
    grossMarginPercent,
    exceedsThreshold,
    addProductItem,
    addCustomItem,
  }
}
