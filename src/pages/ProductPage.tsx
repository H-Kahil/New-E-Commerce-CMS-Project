import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";

// Placeholder component - will be expanded in future phases
const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const { data, error } = await products.getProduct(slug, language);

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Product not found");

        setProduct(data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
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
        <p className="mb-4">
          {t("common.products")} {slug} {t("common.notFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {product.product_images && product.product_images[0] ? (
            <img
              src={product.product_images[0].url}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <span className="text-gray-500">{product.category?.name}</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="text-2xl font-bold mb-4">
            ${product.price.toFixed(2)}
            {product.compare_at_price && (
              <span className="ml-2 text-gray-500 line-through text-lg">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-colors">
              {t("product.addToCart")}
            </button>

            <button className="w-full border border-gray-300 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors">
              {t("product.addToWishlist")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
