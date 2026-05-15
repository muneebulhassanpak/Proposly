import { notFound } from "next/navigation"
import { Toaster } from "sonner"

import { PublicProposalPage } from "@/features/proposal/pages/public-proposal.page"
import {
  getProposalByToken,
  trackProposalOpened,
} from "@/features/proposal/services/proposal.service"

interface Props {
  params: Promise<{ token: string }>
}

export default async function PublicProposalRoute({ params }: Props) {
  const { token } = await params
  const proposal = await getProposalByToken(token)

  if (!proposal) notFound()

  // Track open (fire-and-forget, guarded against double-fire in the service)
  trackProposalOpened(proposal.quoteId, proposal.versionId, proposal.repId)

  return (
    <>
      <Toaster position="top-center" richColors />
      <PublicProposalPage proposal={proposal} />
    </>
  )
}
