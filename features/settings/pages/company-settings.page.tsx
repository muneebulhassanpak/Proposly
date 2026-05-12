"use client"

import Image from "next/image"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SUPPORTED_CURRENCIES } from "@/lib/constants/currencies.constants"
import { updateCompanyAction } from "../actions/company.action"
import type { Company } from "../settings.types"

interface CompanySettingsPageProps {
  company: Company | null
}

export function CompanySettingsPage({ company }: CompanySettingsPageProps) {
  const [state, formAction, isPending] = useActionState(
    updateCompanyAction,
    null
  )
  const [logoPreview, setLogoPreview] = useState<string | null>(
    company?.logo_url ?? null
  )
  const [brandColor, setBrandColor] = useState(
    company?.brand_color ?? "#1E40D8"
  )
  const [currency, setCurrency] = useState(company?.default_currency ?? "USD")
  const currencyInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.success) toast.success("Settings saved")
    if (state?.error) toast.error(state.error)
  }, [state])

  // Keep hidden currency input in sync
  useEffect(() => {
    if (currencyInputRef.current) currencyInputRef.current.value = currency
  }, [currency])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Company Settings</h1>
          <p className="mt-1 text-sm text-ink-mute">
            Configure your agency details and defaults.
          </p>
        </div>
        <Button type="submit" form="company-settings-form" loading={isPending}>
          Save settings
        </Button>
      </div>

      <form
        id="company-settings-form"
        action={formAction}
        className="divide-y divide-hairline"
      >
        {/* Logo */}
        <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr]">
          <div>
            <h2 className="text-sm font-medium text-ink">Logo</h2>
            <p className="mt-1 text-sm text-ink-mute">
              Your company&apos;s visual identity.
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-hairline bg-paper">
                  <Image
                    src={logoPreview}
                    alt="Company logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-hairline bg-paper">
                  <span className="text-xs text-ink-faint">No logo</span>
                </div>
              )}
              <div>
                <Label htmlFor="logo" className="mb-1.5 block">
                  Upload logo
                </Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="w-64 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setLogoPreview(URL.createObjectURL(file))
                  }}
                />
                <p className="mt-1 text-xs text-ink-faint">
                  JPG, PNG, WebP, or SVG. Max 2 MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr]">
          <div>
            <h2 className="text-sm font-medium text-ink">Details</h2>
            <p className="mt-1 text-sm text-ink-mute">
              Contact info and billing address.
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Company name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={company?.name ?? ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={company?.email ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={company?.phone ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://"
                  defaultValue={company?.website ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={company?.address ?? ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding + Defaults */}
        <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_1fr]">
          <div>
            <h2 className="text-sm font-medium text-ink">
              Branding &amp; Defaults
            </h2>
            <p className="mt-1 text-sm text-ink-mute">
              Accent color, currency, and tax applied to new quotes.
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Brand color */}
              <div className="space-y-1.5">
                <Label htmlFor="brand_color">Brand accent color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-sm border border-input"
                  />
                  <Input
                    id="brand_color"
                    name="brand_color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="w-28 font-mono uppercase"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-1.5">
                <Label>Default currency</Label>
                <input
                  ref={currencyInputRef}
                  type="hidden"
                  name="default_currency"
                  defaultValue={currency}
                />
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tax */}
              <div className="space-y-1.5">
                <Label htmlFor="default_tax_percent">Default tax (%)</Label>
                <Input
                  id="default_tax_percent"
                  name="default_tax_percent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  defaultValue={company?.default_tax_percent ?? 0}
                  className="w-28"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
