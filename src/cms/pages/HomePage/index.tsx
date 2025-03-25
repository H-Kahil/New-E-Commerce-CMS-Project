import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../components/HeroSection";
import FeaturedCategories from "../../components/FeaturedCategories";
import ProductGrid from "../../../ecommerce/products/ProductGrid";
import PromotionalBanner from "../../components/PromotionalBanner";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";

interface HomePageProps {
  currentLanguage?: "en" | "ar";
  onLanguageChange?: (language: "en" | "ar") => void;
}

const HomePage = ({
  currentLanguage = "en",
  onLanguageChange = () => {},
}: HomePageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isRTL = currentLanguage === "ar";

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real implementation, this would trigger a search API call
    console.log("Searching for:", query);
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    // In a real implementation, this would add the product to the cart
    console.log(`Adding product ${productId} to cart, quantity: ${quantity}`);
  };

  const handleAddToWishlist = (productId: string) => {
    // In a real implementation, this would add the product to the wishlist
    console.log(`Adding product ${productId} to wishlist`);
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <Header
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        onSearch={handleSearch}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section>
          <HeroSection />
        </section>

        {/* Featured Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <FeaturedCategories locale={currentLanguage} />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <ProductGrid
              title="Featured Products"
              subtitle="Discover our most popular items"
              columns={3}
              maxItems={6}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
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
              title="New Arrivals"
              subtitle="Check out our latest products"
              columns={4}
              maxItems={8}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {isRTL ? "انضم إلى نشرتنا الإخبارية" : "Join Our Newsletter"}
            </h2>
            <p className="mb-8 mx-auto max-w-2xl">
              {isRTL
                ? "اشترك للحصول على آخر الأخبار والعروض الخاصة والتحديثات."
                : "Subscribe to receive the latest news, special offers, and updates."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={
                  isRTL ? "عنوان البريد الإلكتروني" : "Email address"
                }
                className="px-4 py-3 rounded-md flex-grow text-gray-900"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                {isRTL ? "اشتراك" : "Subscribe"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
