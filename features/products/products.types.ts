import type { Database } from "@/lib/supabase/database.types"

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type PriceHistory =
  Database["public"]["Tables"]["product_price_history"]["Row"] & {
    changer_name?: string | null
  }
