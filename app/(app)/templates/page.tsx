import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"

export default async function TemplatesPage() {
  await requireRole([USER_ROLES.REP, USER_ROLES.ADMIN])

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Templates</h1>
      <p className="mt-1 text-sm text-ink-mute">Coming in Sprint 9.</p>
    </div>
  )
}
