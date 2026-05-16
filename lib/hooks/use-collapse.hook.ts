"use client"

import { useState } from "react"

export function useCollapse(initialCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  function toggleCollapse() {
    setIsCollapsed((prev) => !prev)
  }

  return { isCollapsed, toggleCollapse }
}
