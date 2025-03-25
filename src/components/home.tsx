import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../cms/components/HeroSection";
import FeaturedCategories from "../cms/components/FeaturedCategories";
import ProductGrid from "../ecommerce/components/ProductGrid";
import PromotionalBanner from "../cms/components/PromotionalBanner";

// Create a Footer component since it's referenced but not imported
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  All Products
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">123 Commerce St.</p>
            <p className="mb-2">City, Country</p>
            <p className="mb-2">+1 (123) 456-7890</p>
            <p className="mb-4">support@example.com</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} E-Commerce Store. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Create a Header component since it's referenced but not imported
const Header = ({
  isRTL = false,
  currentLanguage = "en",
  onLanguageChange = () => {},
  onSearch = () => {},
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary">
              E-Store
            </a>
            <nav className="hidden md:flex ml-10 space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Shop
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Sale
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder={isRTL ? "بحث..." : "Search..."}
                className="py-2 px-4 border rounded-full w-40 lg:w-64"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() =>
                onLanguageChange(currentLanguage === "en" ? "ar" : "en")
              }
              className="px-3 py-1 border rounded-md"
            >
              {currentLanguage === "en" ? "AR" : "EN"}
            </button>
            <a
              href="#"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

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
