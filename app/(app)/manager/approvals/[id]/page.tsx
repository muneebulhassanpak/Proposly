import { ApprovalDetailPage } from "@/features/approvals/pages/approval-detail.page"

export default async function ApprovalDetailRoute(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  return <ApprovalDetailPage approvalId={id} />
}
