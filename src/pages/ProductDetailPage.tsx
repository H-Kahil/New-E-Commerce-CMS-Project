import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";
import ProductDetail from "../ecommerce/components/ProductDetail";

interface ProductDetailPageProps {}

const ProductDetailPage: React.FC<ProductDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Use the getProduct function from the products service
        const { data, error } = await products.getProduct(id, language);

        if (error) {
          console.error("Error fetching product:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Product not found");
        }

        setProduct(data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, language]);

  const handleAddToCart = (id: string, variantId: string, quantity: number) => {
    console.log("Added to cart:", { id, variantId, quantity });
    // Implement cart functionality here
  };

  const handleAddToWishlist = (id: string) => {
    console.log("Added to wishlist:", { id });
    // Implement wishlist functionality here
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 w-20 bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Product not found"}
        </h1>
        <p className="mb-4">{t("common.errorOccurred")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail
        {...product}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </div>
  );
};

export default ProductDetailPage;
