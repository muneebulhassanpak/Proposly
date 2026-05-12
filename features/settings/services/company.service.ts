import { createClient } from "@/lib/supabase/server.service"
import type { Company } from "../settings.types"

export async function getCompany(companyId: string): Promise<Company | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single()
  return data
}
