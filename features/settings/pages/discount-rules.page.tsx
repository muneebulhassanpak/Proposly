"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { upsertDiscountRuleAction } from "../actions/discount-rules.action"
import type { DiscountRule } from "../settings.types"

interface DiscountRulesPageProps {
  rule: DiscountRule | null
}

export function DiscountRulesPage({ rule }: DiscountRulesPageProps) {
  const [state, formAction, isPending] = useActionState(
    upsertDiscountRuleAction,
    null
  )

  useEffect(() => {
    if (state?.success) toast.success("Discount rule saved")
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Discount Rules</h1>
        <p className="mt-1 text-sm text-ink-mute">
          Set the approval threshold for discounts.
        </p>
      </div>

      {rule && (
        <div className="mb-6 rounded-lg border border-hairline bg-surface p-4">
          <p className="text-sm text-ink-mute">Current rule</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink tabular-nums">
            {rule.threshold_percent}%
          </p>
        </div>
      )}

      <div className="rounded-lg border border-hairline bg-surface p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="threshold_percent">Approval threshold (%)</Label>
            <Input
              id="threshold_percent"
              name="threshold_percent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              defaultValue={rule?.threshold_percent ?? 0}
              required
              className="w-32"
            />
          </div>

          <p className="text-xs text-ink-mute">
            Discounts strictly above this percentage will require manager
            approval.
          </p>

          <Button type="submit" loading={isPending}>
            Save rule
          </Button>
        </form>
      </div>
    </div>
  )
}
