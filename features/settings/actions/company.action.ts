"use server"

import { revalidatePath } from "next/cache"

import { requireRole } from "@/lib/auth.utils"
import { companySchema } from "../schemas/company.schema"
import { updateCompany, uploadCompanyLogo } from "../services/company.service"

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

  let logo_url: string | undefined

  const logoFile = formData.get("logo") as File | null
  if (logoFile && logoFile.size > 0) {
    const { url, error: uploadError } = await uploadCompanyLogo(
      profile.company_id,
      logoFile
    )
    if (uploadError) return { error: `Logo upload failed: ${uploadError}` }
    logo_url = url ?? undefined
  }

  const { error } = await updateCompany(profile.company_id, {
    ...parsed.data,
    ...(logo_url ? { logo_url } : {}),
  })

  if (error) return { error }

  revalidatePath("/admin/settings")
  return { success: true }
}
