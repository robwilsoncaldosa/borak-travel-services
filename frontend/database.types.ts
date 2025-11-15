export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          destination: string
          id: string
          package_id: string
          packs: number
          paid_amount: number | null
          payment_status: string
          pickup_date: string
          pickup_location: string
          pickup_time: string | null
          price: number | null
          return_date: string
          return_time: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          destination: string
          id?: string
          package_id: string
          packs: number
          paid_amount?: number | null
          payment_status?: string
          pickup_date: string
          pickup_location: string
          pickup_time?: string | null
          price?: number | null
          return_date: string
          return_time?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          destination?: string
          id?: string
          package_id?: string
          packs?: number
          paid_amount?: number | null
          payment_status?: string
          pickup_date?: string
          pickup_location?: string
          pickup_time?: string | null
          price?: number | null
          return_date?: string
          return_time?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      guest_users: {
        Row: {
          created_at: string | null
          email: string
          firstname: string | null
          id: string
          lastname: string | null
          middlename: string | null
          mobile: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          middlename?: string | null
          mobile?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          middlename?: string | null
          mobile?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          image_urls: string[] | null
          is_admin: boolean | null
          is_read: boolean | null
          message: string
          timestamp: string | null
          user_id: string
          username: string
        }
        Insert: {
          id?: string
          image_urls?: string[] | null
          is_admin?: boolean | null
          is_read?: boolean | null
          message: string
          timestamp?: string | null
          user_id: string
          username: string
        }
        Update: {
          id?: string
          image_urls?: string[] | null
          is_admin?: boolean | null
          is_read?: boolean | null
          message?: string
          timestamp?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          about_tour: string
          activities: string[] | null
          created_at: string | null
          duration_hours: number
          highlights: string[] | null
          id: string
          images: string[] | null
          inclusions: string[] | null
          itinerary: Json | null
          location: string
          long_description: string | null
          max_guests: number | null
          rating: number | null
          reviews: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          about_tour: string
          activities?: string[] | null
          created_at?: string | null
          duration_hours: number
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          itinerary?: Json | null
          location: string
          long_description?: string | null
          max_guests?: number | null
          rating?: number | null
          reviews?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          about_tour?: string
          activities?: string[] | null
          created_at?: string | null
          duration_hours?: number
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          itinerary?: Json | null
          location?: string
          long_description?: string | null
          max_guests?: number | null
          rating?: number | null
          reviews?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          guest_id: string
          id: string
          package_id: string
          rating: number
          review: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guest_id: string
          id?: string
          package_id: string
          rating: number
          review: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guest_id?: string
          id?: string
          package_id?: string
          rating?: number
          review?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          firstname: string
          id: string
          lastname: string
          mobile: string
          nationality: string
          password: string
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          firstname: string
          id?: string
          lastname: string
          mobile: string
          nationality: string
          password: string
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          firstname?: string
          id?: string
          lastname?: string
          mobile?: string
          nationality?: string
          password?: string
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
