export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "SGD",
  "AED",
  "INR",
] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]
