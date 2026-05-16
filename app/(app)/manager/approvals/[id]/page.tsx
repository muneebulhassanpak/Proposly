import { requireRole } from "@/lib/auth.utils"
import { USER_ROLES } from "@/lib/constants/roles.constants"
import { ApprovalDetailPage } from "@/features/approvals/pages/approval-detail.page"

export default async function ApprovalDetailRoute(props: {
  params: Promise<{ id: string }>
}) {
  await requireRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN])
  const { id } = await props.params
  return <ApprovalDetailPage approvalId={id} />
}
