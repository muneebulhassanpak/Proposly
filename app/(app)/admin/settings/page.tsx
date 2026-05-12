import { requireAuth } from "@/lib/auth.utils"
import { getCompany } from "@/features/settings/services/company.service"
import { CompanySettingsPage } from "@/features/settings/pages/company-settings.page"

export default async function Page() {
  const profile = await requireAuth()
  const company = await getCompany(profile.company_id!)
  return <CompanySettingsPage company={company} />
}
