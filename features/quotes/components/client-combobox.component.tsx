"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, ChevronsUpDown, Plus, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  createClientAction,
  searchClientsAction,
} from "../actions/save-draft.action"
import type { Client } from "../quotes.types"

interface ClientComboboxProps {
  value: string | null
  selectedClient: Client | null
  onChange: (clientId: string | null, client: Client | null) => void
}

function CreateClientDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: (client: Client) => void
}) {
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
        onOpenChange(false)
        setName("")
        setEmail("")
        setCompany("")
        setPhone("")
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="client-name">Name</Label>
            <Input
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@acme.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client-company">Company</Label>
            <Input
              id="client-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client-phone">Phone</Label>
            <Input
              id="client-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button
            onClick={() => create.mutate()}
            loading={create.isPending}
            disabled={!name.trim()}
          >
            Create client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ClientCombobox({
  value,
  selectedClient,
  onChange,
}: ClientComboboxProps) {
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

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-[6px] border border-hairline bg-surface px-3 text-sm transition-colors hover:bg-paper focus:ring-2 focus:ring-accent/40 focus:outline-none",
              !value && "text-ink-mute"
            )}
          >
            <span className="truncate">{displayLabel}</span>
            <ChevronsUpDown
              size={14}
              strokeWidth={1.5}
              className="shrink-0 text-ink-mute"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search clients…"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty className="py-4 text-center text-sm text-ink-mute">
                No clients found.
              </CommandEmpty>
              {clients.length > 0 && (
                <CommandGroup>
                  {clients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={client.id}
                      onSelect={() => {
                        onChange(client.id, client)
                        setOpen(false)
                        setSearch("")
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">
                          {client.name}
                        </p>
                        {client.company_name && (
                          <p className="truncate text-xs text-ink-mute">
                            {client.company_name}
                          </p>
                        )}
                      </div>
                      <Check
                        size={14}
                        strokeWidth={1.5}
                        className={cn(
                          "shrink-0 text-accent",
                          value === client.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setCreateOpen(true)
                  }}
                >
                  <UserPlus size={14} strokeWidth={1.5} />
                  Create new client
                </CommandItem>
                {value && (
                  <CommandItem
                    onSelect={() => {
                      onChange(null, null)
                      setOpen(false)
                    }}
                  >
                    <Plus
                      size={14}
                      strokeWidth={1.5}
                      className="rotate-45 text-crimson"
                    />
                    <span className="text-crimson">Clear selection</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateClientDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(client) => {
          onChange(client.id, client)
        }}
      />
    </>
  )
}
