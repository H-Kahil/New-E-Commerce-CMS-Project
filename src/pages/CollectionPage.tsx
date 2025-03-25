import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";

// Components
import ProductGrid from "../ecommerce/products/ProductGrid";

// Placeholder component - will be expanded in future phases
const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<any>(null);
  const [collectionProducts, setCollectionProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Fetch collection details
        const { data: collectionsData, error: collectionError } =
          await products.getCollections(language);

        if (collectionError) throw new Error(collectionError.message);

        const foundCollection = collectionsData?.find(
          (col) => col.slug === slug,
        );
        if (!foundCollection) throw new Error("Collection not found");

        setCollection(foundCollection);

        // Fetch products in this collection
        const { data: productsData, error: productsError } =
          await products.getProducts({
            collection: slug,
            locale: language,
            limit: 20,
          });

        if (productsError) throw new Error(productsError.message);
        setCollectionProducts(productsData || []);
      } catch (err: any) {
        console.error("Error fetching collection data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionAndProducts();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Collection not found"}
        </h1>
        <p className="mb-4">
          {t("common.collection")} {slug} {t("common.notFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
        {collection.description && (
          <p className="text-gray-600">{collection.description}</p>
        )}
      </div>

      <ProductGrid
        products={collectionProducts}
        title=""
        showFilters={true}
        showSorting={true}
        showViewToggle={true}
        showSearch={true}
        columns={3}
      />
    </div>
  );
};

export default CollectionPage;
