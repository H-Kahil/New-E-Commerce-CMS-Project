export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_ad_zones: {
        Row: {
          id: string;
          name: string;
          location: string;
          description: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          description?: string | null;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          description?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_ads: {
        Row: {
          id: string;
          title: string;
          zone_id: string;
          image_url: string;
          link_url: string;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          zone_id: string;
          image_url: string;
          link_url: string;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          zone_id?: string;
          image_url?: string;
          link_url?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_blocks: {
        Row: {
          id: string;
          section_id: string;
          type: string;
          content: Json;
          order: number;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          type: string;
          content: Json;
          order?: number;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          type?: string;
          content?: Json;
          order?: number;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_media: {
        Row: {
          id: string;
          filename: string;
          url: string;
          type: string;
          size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          url: string;
          type: string;
          size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          url?: string;
          type?: string;
          size?: number;
          created_at?: string;
        };
      };
      cms_menu_items: {
        Row: {
          id: string;
          menu_id: string;
          parent_id: string | null;
          title: string;
          url: string;
          order: number;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          parent_id?: string | null;
          title: string;
          url: string;
          order?: number;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          parent_id?: string | null;
          title?: string;
          url?: string;
          order?: number;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_menus: {
        Row: {
          id: string;
          name: string;
          location: string;
          order: number;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          order?: number;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          order?: number;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_navigation: {
        Row: {
          id: string;
          title: string;
          url: string;
          order: number;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          order?: number;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          order?: number;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cms_sections: {
        Row: {
          id: string;
          page_id: string;
          type: string;
          title: string | null;
          order: number;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          type: string;
          title?: string | null;
          order?: number;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_id?: string;
          type?: string;
          title?: string | null;
          order?: number;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_categories: {
        Row: {
          id: string;
          product_id: string;
          category_id: string;
          category_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          category_id: string;
          category_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          category_id?: string;
          category_slug?: string;
          created_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt?: string | null;
          order?: number;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string;
          price: number;
          sale_price: number | null;
          inventory: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku: string;
          price: number;
          sale_price?: number | null;
          inventory: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          sku?: string;
          price?: number;
          sale_price?: number | null;
          inventory?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          sale_price: number | null;
          is_featured: boolean;
          collection_id: string | null;
          collection_slug: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          sale_price?: number | null;
          is_featured?: boolean;
          collection_id?: string | null;
          collection_slug?: string | null;
          locale: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          sale_price?: number | null;
          is_featured?: boolean;
          collection_id?: string | null;
          collection_slug?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
