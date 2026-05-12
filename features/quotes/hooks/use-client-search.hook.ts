"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  createClientAction,
  searchClientsAction,
} from "../actions/save-draft.action"
import type { Client } from "../quotes.types"

export function useClientSearch(
  value: string | null,
  selectedClient: Client | null
) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-search", debouncedSearch],
    queryFn: () => searchClientsAction(debouncedSearch),
    staleTime: 30_000,
  })

  const displayLabel = selectedClient
    ? selectedClient.name
    : value
      ? "Loading…"
      : "Select client"

  return {
    open,
    setOpen,
    search,
    setSearch,
    createOpen,
    setCreateOpen,
    clients,
    displayLabel,
  }
}

export function useCreateClient(
  onCreated: (client: Client) => void,
  onClose: () => void
) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")

  const create = useMutation({
    mutationFn: () =>
      createClientAction({ name, email, company_name: company, phone }),
    onSuccess: (result) => {
      if (result.success) {
        onCreated(result.client)
        onClose()
        setName("")
        setEmail("")
        setCompany("")
        setPhone("")
      }
    },
  })

  return {
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    phone,
    setPhone,
    create,
  }
}
