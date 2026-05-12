export const PRODUCT_UNITS = [
  "hour",
  "page",
  "project",
  "item",
  "word",
  "custom",
] as const

export type ProductUnit = (typeof PRODUCT_UNITS)[number]
