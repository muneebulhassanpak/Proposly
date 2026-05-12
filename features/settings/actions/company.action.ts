"use server"

import { revalidatePath } from "next/cache"

import { requireRole } from "@/lib/auth.utils"
import { createClient } from "@/lib/supabase/server.service"
import { companySchema } from "../schemas/company.schema"

export type CompanyActionState = {
  error?: string
  success?: boolean
} | null

export async function updateCompanyAction(
  _prev: CompanyActionState,
  formData: FormData
): Promise<CompanyActionState> {
  const profile = await requireRole("admin")
  if (!profile.company_id)
    return { error: "No company associated with account" }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    website: formData.get("website") || null,
    address: formData.get("address") || null,
    brand_color: formData.get("brand_color") || null,
    default_currency: formData.get("default_currency") ?? "USD",
    default_tax_percent: formData.get("default_tax_percent"),
  }

  const parsed = companySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  // Handle logo upload if provided
  const logoFile = formData.get("logo") as File | null
  let logo_url: string | undefined

  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop()
    const path = `${profile.company_id}/logo.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, logoFile, { upsert: true })

    if (uploadError)
      return { error: `Logo upload failed: ${uploadError.message}` }

    const {
      data: { publicUrl },
    } = supabase.storage.from("logos").getPublicUrl(path)
    logo_url = publicUrl
  }

  const { error } = await supabase
    .from("companies")
    .update({ ...parsed.data, ...(logo_url ? { logo_url } : {}) })
    .eq("id", profile.company_id)

  if (error) return { error: error.message }

  revalidatePath("/admin/settings")
  return { success: true }
}
