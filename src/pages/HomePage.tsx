import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRtl } from "../contexts/RtlContext";
import { cms, products } from "../services/supabase";

// Components
import HeroSection from "../cms/components/HeroSection";
import FeaturedCategories from "../cms/components/FeaturedCategories";
import ProductGrid from "../ecommerce/products/ProductGrid";
import PromotionalBanner from "../cms/components/PromotionalBanner";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch home page with sections and blocks
        const { data: pageData, error: pageError } =
          await cms.getPageWithSectionsAndBlocks("home", language);

        if (pageError) {
          console.error("Error fetching page data:", pageError);
          // Don't throw error here, continue with other requests
        }

        // Fetch featured products
        const { data: productsData, error: productsError } =
          await products.getProducts({
            featured: true,
            limit: 6,
            locale: language,
          });

        if (productsError) {
          console.error("Error fetching products:", productsError);
          // Don't throw error here, continue with other requests
        }

        setPage(pageData || null);
        setFeaturedProducts(productsData || []);
      } catch (err: any) {
        console.error("Error fetching home page data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Error loading page"}
        </h1>
        <p className="mb-4">{t("common.errorOccurred")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <FeaturedCategories locale={language} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductGrid
            title={t("home.featuredProducts")}
            subtitle={t("home.featuredProducts")}
            products={
              featuredProducts.length > 0 ? featuredProducts : undefined
            }
            columns={3}
            maxItems={6}
          />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-8">
        <PromotionalBanner />
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProductGrid
            title={t("home.newArrivals")}
            subtitle={t("home.newArrivals")}
            columns={4}
            maxItems={8}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("home.joinNewsletter")}
          </h2>
          <p className="mb-8 mx-auto max-w-2xl">
            {t("home.newsletterSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="px-4 py-3 rounded-md flex-grow text-gray-900"
            />
            <button className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              {t("footer.subscribeButton")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
