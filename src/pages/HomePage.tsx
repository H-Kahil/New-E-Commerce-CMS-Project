import React from "react";
import { useTranslation } from "react-i18next";
import { useRtl } from "../contexts/RtlContext";

// Components
import HeroSection from "../cms/components/HeroSection";
import FeaturedCategories from "../cms/components/FeaturedCategories";
import ProductGrid from "../ecommerce/products/ProductGrid";
import PromotionalBanner from "../cms/components/PromotionalBanner";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();

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
