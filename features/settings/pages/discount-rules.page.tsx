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
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink">Discount Rules</h1>
        <p className="mt-1 text-sm text-ink-mute">
          Set the approval threshold for discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div>
          <h2 className="text-sm font-medium text-ink">Approval threshold</h2>
          <p className="mt-1 text-sm text-ink-mute">
            Discounts strictly above this percentage require manager approval.
            Discounts at exactly the threshold do not.
          </p>
          {rule && (
            <div className="mt-4">
              <p className="text-xs text-ink-mute">Current</p>
              <p className="mt-0.5 font-mono text-2xl font-semibold text-ink tabular-nums">
                {rule.threshold_percent}%
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="threshold_percent">Threshold (%)</Label>
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

            <Button type="submit" loading={isPending}>
              Save rule
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
