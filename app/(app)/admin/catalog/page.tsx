import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { CatalogPage } from "@/features/products/pages/catalog.page"

export default async function Page() {
  await requireRole(USER_ROLES.ADMIN)
  return <CatalogPage />
}
