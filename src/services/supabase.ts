import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Initialize Supabase client
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.warn(
    "Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth services
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },
  getSession: async () => {
    return await supabase.auth.getSession();
  },
};

// CMS services
export const cms = {
  getPage: async (slug: string, locale: string = "en") => {
    return await supabase
      .from("cms_pages")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .single();
  },
  getPages: async (locale: string = "en") => {
    return await supabase
      .from("cms_pages")
      .select("*")
      .eq("locale", locale)
      .order("created_at", { ascending: false });
  },
  getNavigation: async (locale: string = "en") => {
    return await supabase
      .from("cms_navigation")
      .select("*")
      .eq("locale", locale)
      .order("order", { ascending: true });
  },
  // New CMS functions
  getSections: async (pageId: string, locale: string = "en") => {
    return await supabase
      .from("cms_sections")
      .select("*")
      .eq("page_id", pageId)
      .eq("locale", locale)
      .order("order", { ascending: true });
  },
  getBlocks: async (sectionId: string, locale: string = "en") => {
    return await supabase
      .from("cms_blocks")
      .select("*")
      .eq("section_id", sectionId)
      .eq("locale", locale)
      .order("order", { ascending: true });
  },
  getPageWithSectionsAndBlocks: async (slug: string, locale: string = "en") => {
    // First get the page
    const { data: page, error: pageError } = await supabase
      .from("cms_pages")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .single();

    if (pageError || !page) return { data: null, error: pageError };

    // Get sections for this page
    const { data: sections, error: sectionsError } = await supabase
      .from("cms_sections")
      .select("*")
      .eq("page_id", page.id)
      .eq("locale", locale)
      .order("order", { ascending: true });

    if (sectionsError)
      return { data: { ...page, sections: [] }, error: sectionsError };

    // Get blocks for each section
    const sectionsWithBlocks = await Promise.all(
      sections.map(async (section) => {
        const { data: blocks, error: blocksError } = await supabase
          .from("cms_blocks")
          .select("*")
          .eq("section_id", section.id)
          .eq("locale", locale)
          .order("order", { ascending: true });

        return {
          ...section,
          blocks: blocksError ? [] : blocks,
        };
      }),
    );

    return {
      data: {
        ...page,
        sections: sectionsWithBlocks,
      },
      error: null,
    };
  },
  getAdZones: async (locale: string = "en") => {
    return await supabase
      .from("cms_ad_zones")
      .select("*, cms_ads(*)")
      .eq("locale", locale);
  },
  getMedia: async (
    options: { type?: string; limit?: number; offset?: number } = {},
  ) => {
    const { type, limit = 20, offset = 0 } = options;

    let query = supabase.from("cms_media").select("*");

    if (type) {
      query = query.eq("type", type);
    }

    return await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });
  },
};

// Product services
export const products = {
  getProducts: async (
    options: {
      category?: string;
      collection?: string;
      featured?: boolean;
      limit?: number;
      offset?: number;
      locale?: string;
    } = {},
  ) => {
    const {
      category,
      collection,
      featured,
      limit = 10,
      offset = 0,
      locale = "en",
    } = options;

    let query = supabase
      .from("products")
      .select("*, product_categories!inner(*), product_images(*)")
      .eq("locale", locale);

    if (category) {
      query = query.eq("product_categories.category_slug", category);
    }

    if (collection) {
      query = query.eq("collection_slug", collection);
    }

    if (featured !== undefined) {
      query = query.eq("is_featured", featured);
    }

    return await query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });
  },

  getProduct: async (slug: string, locale: string = "en") => {
    return await supabase
      .from("products")
      .select(
        "*, product_categories(*), product_images(*), product_variants(*)",
      )
      .eq("slug", slug)
      .eq("locale", locale)
      .single();
  },

  getCategories: async (locale: string = "en") => {
    return await supabase
      .from("categories")
      .select("*")
      .eq("locale", locale)
      .order("name", { ascending: true });
  },

  getCollections: async (locale: string = "en") => {
    return await supabase
      .from("collections")
      .select("*")
      .eq("locale", locale)
      .order("name", { ascending: true });
  },
};
