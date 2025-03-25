import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/shared/utils";
import LanguageSwitcher from "../LanguageSwitcher";
import CartPreview from "../../../ecommerce/cart/CartPreview";
import NavigationMenu from "../NavigationMenu";

interface HeaderProps {
  logo?: string;
  isRTL?: boolean;
  onSearch?: (query: string) => void;
  currentLanguage?: "en" | "ar";
  onLanguageChange?: (language: "en" | "ar") => void;
}

const Header = ({
  logo = "E-Store",
  isRTL = false,
  onSearch = () => {},
  currentLanguage = "en",
  onLanguageChange = () => {},
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b shadow-sm",
        isRTL ? "direction-rtl" : "",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">{logo}</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:block flex-1 mx-6">
            <NavigationMenu />
          </div>

          {/* Search, Language Switcher, and Cart - Rearranged on Mobile */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Form - Hidden on Small Mobile */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex items-center relative max-w-xs"
            >
              <Input
                type="search"
                placeholder="Search products..."
                className="pr-8 h-9 w-[180px] lg:w-[240px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Language Switcher */}
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />

            {/* Cart Preview */}
            <CartPreview />

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[350px] pt-10">
                <div className="flex flex-col h-full">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit} className="mb-6">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pr-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-4 flex-1 overflow-auto py-4">
                    <div className="text-lg font-medium">Categories</div>
                    <div className="pl-2 space-y-2">
                      <Link
                        to="/category/electronics"
                        className="block py-2 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Electronics
                      </Link>
                      <Link
                        to="/category/clothing"
                        className="block py-2 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Clothing
                      </Link>
                      <Link
                        to="/category/home-garden"
                        className="block py-2 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home & Garden
                      </Link>
                      <Link
                        to="/category/beauty"
                        className="block py-2 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Beauty
                      </Link>
                      <Link
                        to="/promotions"
                        className="block py-2 text-red-500 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Promotions
                      </Link>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="border-t pt-4 space-y-2">
                    <Link
                      to="/account"
                      className="block py-2 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block py-2 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/contact"
                      className="block py-2 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
