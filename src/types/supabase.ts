export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          product_variant_id: string | null
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          product_variant_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          product_variant_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          level: number | null
          locale: string
          name: string
          name_ar: string | null
          name_en: string | null
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: number | null
          locale?: string
          name: string
          name_ar?: string | null
          name_en?: string | null
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: number | null
          locale?: string
          name?: string
          name_ar?: string | null
          name_en?: string | null
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_parent_category"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_ad_zones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          locale: string
          location: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          locale?: string
          location: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          locale?: string
          location?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_ads: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          image_url: string
          is_active: boolean
          link_url: string
          locale: string
          start_date: string | null
          title: string
          updated_at: string | null
          zone_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          link_url: string
          locale?: string
          start_date?: string | null
          title: string
          updated_at?: string | null
          zone_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string
          locale?: string
          start_date?: string | null
          title?: string
          updated_at?: string | null
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_ads_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "cms_ad_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_blocks: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          locale: string
          position: number
          section_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          locale?: string
          position?: number
          section_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          locale?: string
          position?: number
          section_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_blocks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "cms_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media: {
        Row: {
          created_at: string | null
          filename: string
          id: string
          size: number
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          filename: string
          id?: string
          size: number
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          filename?: string
          id?: string
          size?: number
          type?: string
          url?: string
        }
        Relationships: []
      }
      cms_menu_items: {
        Row: {
          created_at: string | null
          id: string
          locale: string
          menu_id: string
          parent_id: string | null
          position: number
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          locale?: string
          menu_id: string
          parent_id?: string | null
          position?: number
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          locale?: string
          menu_id?: string
          parent_id?: string | null
          position?: number
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cms_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_menus: {
        Row: {
          created_at: string | null
          id: string
          locale: string
          location: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          locale?: string
          location: string
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          locale?: string
          location?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_navigation: {
        Row: {
          created_at: string | null
          id: string
          locale: string
          position: number
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          locale?: string
          position?: number
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          locale?: string
          position?: number
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          locale: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          locale?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          locale?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_sections: {
        Row: {
          created_at: string | null
          id: string
          locale: string
          page_id: string
          position: number
          title: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          locale?: string
          page_id: string
          position?: number
          title?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          locale?: string
          page_id?: string
          position?: number
          title?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          locale: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          locale?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          locale?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          product_variant_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          product_variant_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_variant_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          created_at: string | null
          id: string
          payment_method: string
          payment_status: string
          shipping_address: Json
          status: string
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address: Json
          created_at?: string | null
          id?: string
          payment_method: string
          payment_status?: string
          shipping_address: Json
          status?: string
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: Json
          created_at?: string | null
          id?: string
          payment_method?: string
          payment_status?: string
          shipping_address?: Json
          status?: string
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          category_slug: string
          created_at: string | null
          id: string
          product_id: string
        }
        Insert: {
          category_id: string
          category_slug: string
          created_at?: string | null
          id?: string
          product_id: string
        }
        Update: {
          category_id?: string
          category_slug?: string
          created_at?: string | null
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          position: number
          product_id: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          position?: number
          product_id: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          position?: number
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_attributes: {
        Row: {
          created_at: string | null
          id: string
          name: string
          value: string
          variant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          value: string
          variant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          value?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_attributes_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string | null
          id: string
          inventory: number
          name: string
          price: number
          product_id: string
          sale_price: number | null
          sku: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory?: number
          name: string
          price: number
          product_id: string
          sale_price?: number | null
          sku: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory?: number
          name?: string
          price?: number
          product_id?: string
          sale_price?: number | null
          sku?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          collection_id: string | null
          collection_slug: string | null
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean
          locale: string
          price: number
          sale_price: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          collection_id?: string | null
          collection_slug?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean
          locale?: string
          price: number
          sale_price?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          collection_id?: string | null
          collection_slug?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean
          locale?: string
          price?: number
          sale_price?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
