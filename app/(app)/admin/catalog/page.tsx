import { requireRole } from "@/lib/auth.utils"
import { CatalogPage } from "@/features/products/pages/catalog.page"

export default async function Page() {
  await requireRole("admin")
  return <CatalogPage />
}
