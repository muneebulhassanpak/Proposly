import type { Database } from "@/lib/supabase/database.types"

export type Company = Database["public"]["Tables"]["companies"]["Row"]
export type DiscountRule = Database["public"]["Tables"]["discount_rules"]["Row"]
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"]
export type UserRole = Database["public"]["Enums"]["user_role"]
