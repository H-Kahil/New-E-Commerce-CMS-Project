import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductDetail from "../ecommerce/components/ProductDetail";
import { supabase } from "../services/supabase";

interface ProductDetailPageProps {}

const ProductDetailPage: React.FC<ProductDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Fetch the product by id
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (productError) throw productError;
        if (!productData) throw new Error("Product not found");

        // Fetch product images
        const { data: imagesData, error: imagesError } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", productData.id)
          .order("display_order", { ascending: true });

        if (imagesError) throw imagesError;

        // Fetch product variants
        const { data: variantsData, error: variantsError } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", productData.id);

        if (variantsError) throw variantsError;

        // Fetch variant attributes
        const { data: attributesData, error: attributesError } = await supabase
          .from("product_variant_attributes")
          .select("*")
          .in(
            "variant_id",
            variantsData.map((v) => v.id),
          );

        if (attributesError) throw attributesError;

        // Process variants with their attributes
        const processedVariants = variantsData.map((variant) => {
          const variantAttributes = attributesData
            .filter((attr) => attr.variant_id === variant.id)
            .reduce((acc, attr) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {});

          return {
            ...variant,
            attributes: variantAttributes,
          };
        });

        // Fetch related products
        const { data: relatedData, error: relatedError } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", productData.category_id)
          .neq("id", productData.id)
          .limit(4);

        if (relatedError) throw relatedError;

        // Combine all data
        setProduct({
          ...productData,
          images: imagesData.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt_text || productData.name,
            isPrimary: img.is_primary,
          })),
          variants: processedVariants,
          relatedProducts: relatedData,
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async (
    id: string,
    variantId: string,
    quantity: number,
  ) => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Handle guest cart (could store in localStorage)
        console.log("Guest adding to cart:", {
          productId: id,
          variantId,
          quantity,
        });
        return;
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_variant_id", variantId)
        .single();

      if (existingItem) {
        // Update quantity if already in cart
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id);
      } else {
        // Add new item to cart
        await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: id,
          product_variant_id: variantId,
          quantity,
        });
      }

      // Could trigger a cart update notification here
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async (id: string) => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Handle guest wishlist or prompt to login
        console.log("Guest adding to wishlist:", { productId: id });
        return;
      }

      // Check if already in wishlist
      const { data: existingItem } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .single();

      if (!existingItem) {
        // Add to wishlist if not already there
        await supabase.from("wishlist_items").insert({
          user_id: user.id,
          product_id: id,
        });
      }

      // Could trigger a wishlist update notification here
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-gray-200"></div>
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Product Not Found
              </h2>
              <p className="mt-2 text-gray-600">{error}</p>
            </div>
          </div>
        ) : (
          <ProductDetail
            {...product}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
