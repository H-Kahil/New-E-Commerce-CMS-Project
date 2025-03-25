import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/shared/utils";
import LanguageSwitcher from "../LanguageSwitcher";
import CartPreview from "../../../ecommerce/cart/CartPreview";
import NavigationMenu from "../NavigationMenu";
import { cms } from "../../../services/supabase";
import { useRtl } from "../../../contexts/RtlContext";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: string;
  children?: MenuItem[];
}

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { language } = useRtl();

  useEffect(() => {
    const fetchHeaderMenu = async () => {
      try {
        const { data, error } = await cms.getMenuByLocation("header", language);
        if (error) throw new Error(error.message);
        if (data && data.items) {
          setMenuItems(data.items);
        }
      } catch (err) {
        console.error("Error fetching header menu:", err);
        // Fallback to default menu items if fetch fails
      }
    };

    fetchHeaderMenu();
  }, [language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Default menu items as fallback
  const defaultMenuItems: MenuItem[] = [
    {
      id: "1",
      label: "Electronics",
      url: "/category/electronics",
      children: [
        {
          id: "1-1",
          label: "Smartphones",
          url: "/category/electronics/smartphones",
        },
        { id: "1-2", label: "Laptops", url: "/category/electronics/laptops" },
        {
          id: "1-3",
          label: "Accessories",
          url: "/category/electronics/accessories",
        },
      ],
    },
    {
      id: "2",
      label: "Clothing",
      url: "/category/clothing",
      children: [
        { id: "2-1", label: "Men", url: "/category/clothing/men" },
        { id: "2-2", label: "Women", url: "/category/clothing/women" },
        { id: "2-3", label: "Kids", url: "/category/clothing/kids" },
      ],
    },
    {
      id: "3",
      label: "Home & Garden",
      url: "/category/home-garden",
      children: [
        {
          id: "3-1",
          label: "Furniture",
          url: "/category/home-garden/furniture",
        },
        { id: "3-2", label: "Decor", url: "/category/home-garden/decor" },
        { id: "3-3", label: "Kitchen", url: "/category/home-garden/kitchen" },
      ],
    },
    {
      id: "4",
      label: "Beauty",
      url: "/category/beauty",
      children: [
        { id: "4-1", label: "Skincare", url: "/category/beauty/skincare" },
        { id: "4-2", label: "Makeup", url: "/category/beauty/makeup" },
        { id: "4-3", label: "Fragrance", url: "/category/beauty/fragrance" },
      ],
    },
    {
      id: "5",
      label: "Promotions",
      url: "/promotions",
    },
  ];

  // Use fetched menu items or fallback to default
  const displayMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

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
            <NavigationMenu menuItems={displayMenuItems} />
          </div>

          {/* Search, Language Switcher, and Cart - Rearranged on Mobile */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* CMS Link - New */}
            <Link
              to="/cms"
              className="hidden md:flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4 mr-1" />
              <span>CMS</span>
            </Link>

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
                      {displayMenuItems.map((item) => (
                        <React.Fragment key={item.id}>
                          <Link
                            to={item.url}
                            className={`block py-2 hover:text-primary ${item.label === "Promotions" ? "text-red-500 font-medium" : ""}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                          {item.children && item.children.length > 0 && (
                            <div className="pl-4 space-y-2 mt-1 mb-3">
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  to={child.url}
                                  className="block py-1 text-sm hover:text-primary"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                      {/* CMS Link in Mobile Menu */}
                      <Link
                        to="/cms"
                        className="block py-2 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        CMS
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
