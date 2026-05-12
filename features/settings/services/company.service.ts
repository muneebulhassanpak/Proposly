import type { Database } from "@/lib/supabase/database.types"
import { createClient } from "@/lib/supabase/server.service"
import type { Company } from "../settings.types"

type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"]

export async function getCompany(companyId: string): Promise<Company | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single()
  return data
}

export async function uploadCompanyLogo(
  companyId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient()
  const ext = file.name.split(".").pop()
  const path = `${companyId}/logo.${ext}`

  const { error } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true })

  if (error) return { url: null, error: error.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from("logos").getPublicUrl(path)

  return { url: publicUrl, error: null }
}

export async function updateCompany(
  companyId: string,
  data: CompanyUpdate
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("companies")
    .update(data)
    .eq("id", companyId)
  return { error: error?.message ?? null }
}
