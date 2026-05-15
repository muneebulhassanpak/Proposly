"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { getAnalyticsData } from "../services/analytics.service"
import type { DateRangePreset } from "../analytics.types"

export function useAnalytics(companyId: string) {
  const [dateRange, setDateRange] = useState<DateRangePreset>("30d")

  const query = useQuery({
    queryKey: ["analytics", companyId, dateRange],
    queryFn: () => getAnalyticsData(companyId, dateRange),
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    dateRange,
    setDateRange,
  }
}
