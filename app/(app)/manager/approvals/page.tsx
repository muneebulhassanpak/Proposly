import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { ApprovalInboxPage } from "@/features/approvals/pages/approval-inbox.page"

export default async function ApprovalInboxRoute() {
  await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  return <ApprovalInboxPage />
}
