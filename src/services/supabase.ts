import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logs to check environment variables
console.log("Environment check - Supabase URL exists:", !!supabaseUrl);
console.log("Environment check - Supabase Anon Key exists:", !!supabaseAnonKey);

// Check if credentials are available and log warning if not
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
  );
  console.warn(
    "To fix this issue, please go to the project settings on the home page and update the environment variables.",
  );
}

// Create client with environment variables only if they exist
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : (null as any); // Fallback to null with type assertion to prevent TypeScript errors

// Log status for debugging
if (supabase) {
  console.log("Supabase client initialized successfully");
} else {
  console.warn(
    "Supabase client initialization failed - using mock data where possible",
  );
}

// Auth services
export const auth = {
  signUp: async (email: string, password: string) => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase.auth.signUp({ email, password });
    } catch (error) {
      console.error("Error in signUp:", error);
      return { data: null, error };
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error("Error in signIn:", error);
      return { data: null, error };
    }
  },
  signOut: async () => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase.auth.signOut();
    } catch (error) {
      console.error("Error in signOut:", error);
      return { data: null, error };
    }
  },
  getCurrentUser: async () => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase.auth.getUser();
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return { data: null, error };
    }
  },
  getSession: async () => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase.auth.getSession();
    } catch (error) {
      console.error("Error in getSession:", error);
      return { data: null, error };
    }
  },
};

// CMS services
export const cms = {
  getPage: async (slug: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_pages")
        .select("*")
        .eq("slug", slug)
        .eq("locale", locale)
        .single();
    } catch (error) {
      console.error("Error in getPage:", error);
      return { data: null, error };
    }
  },
  getPages: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_pages")
        .select("*")
        .eq("locale", locale)
        .order("created_at", { ascending: false });
    } catch (error) {
      console.error("Error in getPages:", error);
      return { data: null, error };
    }
  },
  getNavigation: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_navigation")
        .select("*")
        .eq("locale", locale);
    } catch (error) {
      console.error("Error in getNavigation:", error);
      return { data: null, error };
    }
  },
  // New CMS functions
  getSections: async (pageId: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_sections")
        .select("*")
        .eq("page_id", pageId)
        .eq("locale", locale);
    } catch (error) {
      console.error("Error in getSections:", error);
      return { data: null, error };
    }
  },
  getBlocks: async (sectionId: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_blocks")
        .select("*")
        .eq("section_id", sectionId)
        .eq("locale", locale);
    } catch (error) {
      console.error("Error in getBlocks:", error);
      return { data: null, error };
    }
  },
  getPageWithSectionsAndBlocks: async (slug: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
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
        .eq("locale", locale);

      if (sectionsError)
        return { data: { ...page, sections: [] }, error: sectionsError };

      // Get blocks for each section
      const sectionsWithBlocks = await Promise.all(
        sections.map(async (section) => {
          const { data: blocks, error: blocksError } = await supabase
            .from("cms_blocks")
            .select("*")
            .eq("section_id", section.id)
            .eq("locale", locale);

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
    } catch (error) {
      console.error("Error in getPageWithSectionsAndBlocks:", error);
      return { data: null, error };
    }
  },
  getAdZones: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_ad_zones")
        .select("*, cms_ads(*)")
        .eq("locale", locale);
    } catch (error) {
      console.error("Error in getAdZones:", error);
      return { data: null, error };
    }
  },
  getAdZoneByLocation: async (location: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("cms_ad_zones")
        .select("*, cms_ads(*)")
        .eq("location", location)
        .eq("locale", locale)
        .single();
    } catch (error) {
      console.error("Error in getAdZoneByLocation:", error);
      return { data: null, error };
    }
  },
  getMenus: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      // First get all menus
      const { data: menus, error: menusError } = await supabase
        .from("cms_menus")
        .select("*")
        .eq("locale", locale);

      if (menusError || !menus) return { data: null, error: menusError };

      // Get menu items for each menu with their nested structure
      const menusWithItems = await Promise.all(
        menus.map(async (menu) => {
          // Get top-level menu items
          const { data: items, error: itemsError } = await supabase
            .from("cms_menu_items")
            .select("*")
            .eq("menu_id", menu.id)
            .is("parent_id", null)
            .eq("locale", locale);

          if (itemsError || !items) return { ...menu, items: [] };

          // Get child items for each top-level item
          const itemsWithChildren = await Promise.all(
            items.map(async (item) => {
              const { data: children, error: childrenError } = await supabase
                .from("cms_menu_items")
                .select("*")
                .eq("parent_id", item.id)
                .eq("locale", locale);

              return {
                ...item,
                children: childrenError ? [] : children,
              };
            }),
          );

          return {
            ...menu,
            items: itemsWithChildren,
          };
        }),
      );

      return { data: menusWithItems, error: null };
    } catch (error) {
      console.error("Error in getMenus:", error);
      return { data: null, error };
    }
  },
  getMenuByLocation: async (location: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      // First get the menu by location
      const { data: menu, error: menuError } = await supabase
        .from("cms_menus")
        .select("*")
        .eq("location", location)
        .eq("locale", locale)
        .single();

      if (menuError || !menu) return { data: null, error: menuError };

      // Get top-level menu items
      const { data: items, error: itemsError } = await supabase
        .from("cms_menu_items")
        .select("*")
        .eq("menu_id", menu.id)
        .is("parent_id", null)
        .eq("locale", locale);

      if (itemsError)
        return { data: { ...menu, items: [] }, error: itemsError };

      // Get child items for each top-level item
      const itemsWithChildren = await Promise.all(
        items.map(async (item) => {
          const { data: children, error: childrenError } = await supabase
            .from("cms_menu_items")
            .select("*")
            .eq("parent_id", item.id)
            .eq("locale", locale);

          return {
            ...item,
            children: childrenError ? [] : children,
          };
        }),
      );

      return {
        data: {
          ...menu,
          items: itemsWithChildren,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error in getMenuByLocation:", error);
      return { data: null, error };
    }
  },
  getMedia: async (
    options: { type?: string; limit?: number; offset?: number } = {},
  ) => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      const { type, limit = 20, offset = 0 } = options;

      let query = supabase.from("cms_media").select("*");

      if (type) {
        query = query.eq("type", type);
      }

      return await query
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });
    } catch (error) {
      console.error("Error in getMedia:", error);
      return { data: null, error };
    }
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
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
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
    } catch (error) {
      console.error("Error in getProducts:", error);
      return { data: null, error };
    }
  },

  getProduct: async (idOrSlug: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      // Try to fetch by slug first (most common case)
      const { data, error } = await supabase
        .from("products")
        .select(
          "*, product_categories(*), product_images(*), product_variants(*)",
        )
        .eq("slug", idOrSlug)
        .eq("locale", locale)
        .single();

      if (data) return { data, error: null };

      // If not found by slug, try by ID
      if (error) {
        // Only try by ID if the error wasn't a connection issue
        if (error.code === "PGRST116") {
          const { data: dataById, error: errorById } = await supabase
            .from("products")
            .select(
              "*, product_categories(*), product_images(*), product_variants(*)",
            )
            .eq("id", idOrSlug)
            .eq("locale", locale)
            .single();

          return { data: dataById, error: errorById };
        }
      }

      return { data, error };
    } catch (error) {
      console.error("Error in getProduct:", error);
      return { data: null, error };
    }
  },

  getCategories: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("categories")
        .select("*")
        .eq("locale", locale)
        .order("name", { ascending: true });
    } catch (error) {
      console.error("Error in getCategories:", error);
      return { data: null, error };
    }
  },

  getCollections: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };
      return await supabase
        .from("collections")
        .select("*")
        .eq("locale", locale)
        .order("name", { ascending: true });
    } catch (error) {
      console.error("Error in getCollections:", error);
      return { data: null, error };
    }
  },
};
