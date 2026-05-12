export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_id: string | null
          created_at: string | null
          event: string
          id: string
          meta: Json | null
          quote_id: string | null
          version_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          event: string
          id?: string
          meta?: Json | null
          quote_id?: string | null
          version_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          event?: string
          id?: string
          meta?: Json | null
          quote_id?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          id: string
          note: string | null
          requested_at: string | null
          requested_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["approval_status"] | null
          version_id: string | null
        }
        Insert: {
          id?: string
          note?: string | null
          requested_at?: string | null
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          version_id?: string | null
        }
        Update: {
          id?: string
          note?: string | null
          requested_at?: string | null
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          company_id: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          brand_color: string | null
          created_at: string | null
          default_currency: string
          default_tax_percent: number
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          brand_color?: string | null
          created_at?: string | null
          default_currency?: string
          default_tax_percent?: number
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          brand_color?: string | null
          created_at?: string | null
          default_currency?: string
          default_tax_percent?: number
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          website?: string | null
        }
        Relationships: []
      }
      discount_rules: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          threshold_percent: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          threshold_percent: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          threshold_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "discount_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          id: string
          opened_at: string | null
          quote_id: string | null
          recipient: string
          sent_at: string | null
          sent_by: string | null
          subject: string | null
          tracking_token: string | null
        }
        Insert: {
          id?: string
          opened_at?: string | null
          quote_id?: string | null
          recipient: string
          sent_at?: string | null
          sent_by?: string | null
          subject?: string | null
          tracking_token?: string | null
        }
        Update: {
          id?: string
          opened_at?: string | null
          quote_id?: string | null
          recipient?: string
          sent_at?: string | null
          sent_by?: string | null
          subject?: string | null
          tracking_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_log_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_log_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          quote_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          quote_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          quote_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_price_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_price: number | null
          old_price: number | null
          product_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_price?: number | null
          old_price?: number | null
          product_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_price?: number | null
          old_price?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_price_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          company_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          unit: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          unit?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          unit?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_line_items: {
        Row: {
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          line_total: number | null
          name: string
          product_id: string | null
          quantity: number | null
          sort_order: number | null
          unit: string | null
          unit_price: number
          version_id: string | null
        }
        Insert: {
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          line_total?: number | null
          name: string
          product_id?: string | null
          quantity?: number | null
          sort_order?: number | null
          unit?: string | null
          unit_price: number
          version_id?: string | null
        }
        Update: {
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          line_total?: number | null
          name?: string
          product_id?: string | null
          quantity?: number | null
          sort_order?: number | null
          unit?: string | null
          unit_price?: number
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_line_items_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "quote_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_template_items: {
        Row: {
          id: string
          name: string
          product_id: string | null
          quantity: number | null
          sort_order: number | null
          template_id: string | null
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          id?: string
          name: string
          product_id?: string | null
          quantity?: number | null
          sort_order?: number | null
          template_id?: string | null
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          id?: string
          name?: string
          product_id?: string | null
          quantity?: number | null
          sort_order?: number | null
          template_id?: string | null
          unit?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_template_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "quote_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_templates: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          quote_id: string | null
          status: Database["public"]["Enums"]["version_status"] | null
          subtotal: number | null
          tax_amount: number | null
          tax_percent: number | null
          total: number | null
          version_number: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["version_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_percent?: number | null
          total?: number | null
          version_number: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["version_status"] | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_percent?: number | null
          total?: number | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_versions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          expires_at: string | null
          id: string
          notes: string | null
          public_token: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          public_token?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          public_token?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_company_id: { Args: never; Returns: string }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      quote_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "sent"
        | "opened"
        | "accepted"
        | "rejected"
        | "expired"
        | "lost"
      user_role: "admin" | "manager" | "rep"
      version_status: "draft" | "active" | "archived" | "superseded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected"],
      quote_status: [
        "draft",
        "pending_approval",
        "approved",
        "sent",
        "opened",
        "accepted",
        "rejected",
        "expired",
        "lost",
      ],
      user_role: ["admin", "manager", "rep"],
      version_status: ["draft", "active", "archived", "superseded"],
    },
  },
} as const
