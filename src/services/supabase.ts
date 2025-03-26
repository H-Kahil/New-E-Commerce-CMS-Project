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

      // Special case for create page
      if (slug === "create") {
        return {
          data: {
            title: "New Page",
            slug: "",
            content: "",
            sections: [],
          },
          error: null,
        };
      }

      // First get the page
      const { data: page, error: pageError } = await supabase
        .from("cms_pages")
        .select("*")
        .eq("slug", slug)
        .eq("locale", locale)
        .single();

      if (pageError || !page) {
        console.error("Error fetching page:", pageError);
        return {
          data: null,
          error: pageError || new Error(`Page with slug '${slug}' not found`),
        };
      }

      // Get sections for this page
      const { data: sections, error: sectionsError } = await supabase
        .from("cms_sections")
        .select("*")
        .eq("page_id", page.id)
        .eq("locale", locale);

      if (sectionsError) {
        console.error("Error fetching sections:", sectionsError);
        return { data: { ...page, sections: [] }, error: sectionsError };
      }

      // Get blocks for each section
      const sectionsWithBlocks = await Promise.all(
        sections.map(async (section) => {
          const { data: blocks, error: blocksError } = await supabase
            .from("cms_blocks")
            .select("*")
            .eq("section_id", section.id)
            .eq("locale", locale);

          if (blocksError) {
            console.error("Error fetching blocks:", blocksError);
          }

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
  createPage: async (pageData: any, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      const { title, slug, content, sections = [] } = pageData;

      // Insert the page
      const { data: page, error: pageError } = await supabase
        .from("cms_pages")
        .insert([
          {
            title,
            slug,
            content,
            locale,
          },
        ])
        .select()
        .single();

      if (pageError) {
        console.error("Error creating page:", pageError);
        return { data: null, error: pageError };
      }

      // Insert sections if any
      if (sections.length > 0 && page) {
        const sectionsWithPageId = sections.map((section: any) => ({
          ...section,
          page_id: page.id,
          locale,
        }));

        const { data: insertedSections, error: sectionsError } = await supabase
          .from("cms_sections")
          .insert(sectionsWithPageId)
          .select();

        if (sectionsError) {
          console.error("Error creating sections:", sectionsError);
          // Continue with the page creation even if sections fail
        }

        // Return the page with sections
        return {
          data: {
            ...page,
            sections: insertedSections || [],
          },
          error: null,
        };
      }

      return { data: page, error: null };
    } catch (error) {
      console.error("Error in createPage:", error);
      return { data: null, error };
    }
  },
  updatePage: async (slug: string, pageData: any, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      // First get the page to update
      const { data: existingPage, error: getError } = await supabase
        .from("cms_pages")
        .select("*")
        .eq("slug", slug)
        .eq("locale", locale)
        .single();

      if (getError) {
        console.error("Error finding page to update:", getError);
        return { data: null, error: getError };
      }

      // Update the page
      const { data: updatedPage, error: updateError } = await supabase
        .from("cms_pages")
        .update({
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPage.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating page:", updateError);
        return { data: null, error: updateError };
      }

      return { data: updatedPage, error: null };
    } catch (error) {
      console.error("Error in updatePage:", error);
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
        limit = 50,
        offset = 0,
        locale = "en",
      } = options;

      let query = supabase
        .from("products")
        .select(
          "*, product_categories!inner(*, categories(*)), product_images(*)",
        )
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
          "*, product_categories(*, categories(*)), product_images(*), product_variants(*)",
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
              "*, product_categories(*, categories(*)), product_images(*), product_variants(*)",
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

  createProduct: async (productData: any, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      const {
        title,
        slug,
        description,
        price,
        sku,
        stock,
        categories = [],
        images = [],
      } = productData;

      // Insert the product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([
          {
            title,
            slug,
            description,
            price,
            sku,
            stock,
            locale,
          },
        ])
        .select()
        .single();

      if (productError) {
        console.error("Error creating product:", productError);
        return { data: null, error: productError };
      }

      // Insert categories if any
      if (categories.length > 0 && product) {
        const productCategories = categories.map((categoryId: string) => ({
          product_id: product.id,
          category_id: categoryId,
          locale,
        }));

        const { error: categoriesError } = await supabase
          .from("product_categories")
          .insert(productCategories);

        if (categoriesError) {
          console.error("Error linking categories:", categoriesError);
        }
      }

      // Insert images if any
      if (images.length > 0 && product) {
        const productImages = images.map((image: any, index: number) => ({
          product_id: product.id,
          url: image.url,
          alt: image.alt || product.title,
          is_primary: index === 0,
          sort_order: index,
          locale,
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(productImages);

        if (imagesError) {
          console.error("Error adding images:", imagesError);
        }
      }

      return { data: product, error: null };
    } catch (error) {
      console.error("Error in createProduct:", error);
      return { data: null, error };
    }
  },

  updateProduct: async (
    id: string,
    productData: any,
    locale: string = "en",
  ) => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      const {
        title,
        slug,
        description,
        price,
        sku,
        stock,
        categories,
        images,
      } = productData;

      // Update the product
      const { data: updatedProduct, error: updateError } = await supabase
        .from("products")
        .update({
          title,
          slug,
          description,
          price,
          sku,
          stock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("locale", locale)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating product:", updateError);
        return { data: null, error: updateError };
      }

      // Update categories if provided
      if (categories && updatedProduct) {
        // First delete existing category links
        await supabase.from("product_categories").delete().eq("product_id", id);

        // Then insert new ones
        if (categories.length > 0) {
          const productCategories = categories.map((categoryId: string) => ({
            product_id: id,
            category_id: categoryId,
            locale,
          }));

          const { error: categoriesError } = await supabase
            .from("product_categories")
            .insert(productCategories);

          if (categoriesError) {
            console.error("Error updating categories:", categoriesError);
          }
        }
      }

      // Update images if provided
      if (images && updatedProduct) {
        // First delete existing images
        await supabase.from("product_images").delete().eq("product_id", id);

        // Then insert new ones
        if (images.length > 0) {
          const productImages = images.map((image: any, index: number) => ({
            product_id: id,
            url: image.url,
            alt: image.alt || updatedProduct.title,
            is_primary: index === 0,
            sort_order: index,
            locale,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(productImages);

          if (imagesError) {
            console.error("Error updating images:", imagesError);
          }
        }
      }

      return { data: updatedProduct, error: null };
    } catch (error) {
      console.error("Error in updateProduct:", error);
      return { data: null, error };
    }
  },

  deleteProduct: async (id: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      // Delete related records first
      await supabase.from("product_categories").delete().eq("product_id", id);
      await supabase.from("product_images").delete().eq("product_id", id);
      await supabase.from("product_variants").delete().eq("product_id", id);

      // Delete the product
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("locale", locale);

      return { data, error };
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      return { data: null, error };
    }
  },

  getCategories: async (
    locale: string = "en",
    options: { parentId?: string | null } = {},
  ) => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      let query = supabase
        .from("categories")
        .select("*, subcategories:categories!parent_id(*)")
        .eq("locale", locale);

      // Filter by parent_id if provided
      if (options.parentId !== undefined) {
        query = query.eq("parent_id", options.parentId);
      }

      return await query.order("name", { ascending: true });
    } catch (error) {
      console.error("Error in getCategories:", error);
      return { data: null, error };
    }
  },

  getCategoryTree: async (locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      // Get root categories (parent_id is null)
      const { data: rootCategories, error } = await supabase
        .from("categories")
        .select("*")
        .eq("locale", locale)
        .is("parent_id", null)
        .order("name", { ascending: true });

      if (error) throw error;

      // Function to recursively fetch child categories
      const fetchChildCategories = async (parentId: string) => {
        const { data: children, error } = await supabase
          .from("categories")
          .select("*")
          .eq("locale", locale)
          .eq("parent_id", parentId)
          .order("name", { ascending: true });

        if (error) throw error;

        // Recursively fetch grandchildren for each child
        const childrenWithSubcategories = await Promise.all(
          children.map(async (child) => {
            const subcategories = await fetchChildCategories(child.id);
            return { ...child, subcategories };
          }),
        );

        return childrenWithSubcategories;
      };

      // Add subcategories to each root category
      const categoryTree = await Promise.all(
        rootCategories.map(async (category) => {
          const subcategories = await fetchChildCategories(category.id);
          return { ...category, subcategories };
        }),
      );

      return { data: categoryTree, error: null };
    } catch (error) {
      console.error("Error in getCategoryTree:", error);
      return { data: null, error };
    }
  },

  getCategoryById: async (id: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      return await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .eq("locale", locale)
        .single();
    } catch (error) {
      console.error("Error in getCategoryById:", error);
      return { data: null, error };
    }
  },

  getCategoryBySlug: async (slug: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      return await supabase
        .from("categories")
        .select(
          "*, parent:categories!parent_id(*), subcategories:categories!categories_parent_id_fkey(*)",
        )
        .eq("slug", slug)
        .eq("locale", locale)
        .single();
    } catch (error) {
      console.error("Error in getCategoryBySlug:", error);
      return { data: null, error };
    }
  },

  createCategory: async (categoryData: any, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      const { name_en, name_ar, slug, parent_id, is_active } = categoryData;

      // Calculate level based on parent
      let level = 0; // Default level for root categories
      if (parent_id) {
        const { data: parent } = await supabase
          .from("categories")
          .select("level")
          .eq("id", parent_id)
          .single();

        if (parent) {
          // Increment parent's level by 1 for the child category
          level = parent.level + 1;
        }
      }

      return await supabase
        .from("categories")
        .insert([
          {
            name: name_en, // Keep for backward compatibility
            name_en,
            name_ar,
            slug,
            parent_id,
            level,
            is_active,
            locale,
          },
        ])
        .select()
        .single();
    } catch (error) {
      console.error("Error in createCategory:", error);
      return { data: null, error };
    }
  },

  updateCategory: async (
    id: string,
    categoryData: any,
    locale: string = "en",
  ) => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      const { name_en, name_ar, slug, parent_id, is_active } = categoryData;

      // Calculate level based on parent
      let level = 0; // Default level for root categories
      if (parent_id) {
        // Check if parent_id is the same as the category being updated to prevent circular references
        if (parent_id === id) {
          return {
            data: null,
            error: new Error("A category cannot be its own parent"),
          };
        }

        // Get the parent's level
        const { data: parent } = await supabase
          .from("categories")
          .select("level")
          .eq("id", parent_id)
          .single();

        if (parent) {
          // Increment parent's level by 1 for the child category
          level = parent.level + 1;
        }

        // Check for circular references in the hierarchy
        let currentParentId = parent_id;
        const visitedIds = new Set<string>();

        while (currentParentId) {
          if (visitedIds.has(currentParentId)) {
            return {
              data: null,
              error: new Error(
                "Circular reference detected in category hierarchy",
              ),
            };
          }

          visitedIds.add(currentParentId);

          const { data: currentParent } = await supabase
            .from("categories")
            .select("parent_id")
            .eq("id", currentParentId)
            .single();

          if (!currentParent) break;
          currentParentId = currentParent.parent_id;

          // If we find the category being updated in the parent chain, it's a circular reference
          if (currentParentId === id) {
            return {
              data: null,
              error: new Error(
                "Circular reference detected in category hierarchy",
              ),
            };
          }
        }
      }

      // Update the category with the calculated level
      const { data: updatedCategory, error: updateError } = await supabase
        .from("categories")
        .update({
          name: name_en, // Keep for backward compatibility
          name_en,
          name_ar,
          slug,
          parent_id,
          level,
          is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("locale", locale)
        .select()
        .single();

      if (updateError) return { data: null, error: updateError };

      // Update levels of all child categories recursively
      await updateChildCategoryLevels(id, level, locale);

      return { data: updatedCategory, error: null };
    } catch (error) {
      console.error("Error in updateCategory:", error);
      return { data: null, error };
    }
  },

  updateChildCategoryLevels: async (
    parentId: string,
    parentLevel: number,
    locale: string,
  ) => {
    if (!supabase) return;

    try {
      // Get all direct children of this parent
      const { data: children, error } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", parentId)
        .eq("locale", locale);

      if (error || !children || children.length === 0) return;

      // Update each child's level
      const childLevel = parentLevel + 1;

      for (const child of children) {
        // Update this child's level
        await supabase
          .from("categories")
          .update({ level: childLevel })
          .eq("id", child.id)
          .eq("locale", locale);

        // Recursively update this child's children
        await products.updateChildCategoryLevels(child.id, childLevel, locale);
      }
    } catch (error) {
      console.error("Error updating child category levels:", error);
    }
  },

  deleteCategory: async (id: string, locale: string = "en") => {
    try {
      if (!supabase)
        return {
          data: null,
          error: new Error("Supabase client not initialized"),
        };

      // First check if there are any subcategories
      const { data: subcategories } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", id);

      if (subcategories && subcategories.length > 0) {
        return {
          data: null,
          error: new Error(
            "Cannot delete category with subcategories. Delete subcategories first or reassign them.",
          ),
        };
      }

      // Delete category-product relationships first
      await supabase.from("product_categories").delete().eq("category_id", id);

      // Then delete the category
      return await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("locale", locale);
    } catch (error) {
      console.error("Error in deleteCategory:", error);
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
