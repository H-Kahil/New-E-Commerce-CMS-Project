import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, FileText, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/shared/utils";
import LanguageSwitcher from "../LanguageSwitcher";
import NavigationMenu from "../NavigationMenu";
import { cms } from "../../../services/supabase";
import { useRtl } from "../../../contexts/RtlContext";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  target?: string;
  children?: MenuItem[];
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { language, direction } = useRtl();

  useEffect(() => {
    const fetchHeaderMenu = async () => {
      try {
        const { data, error } = await cms.getMenuByLocation("header", language);
        if (error) {
          console.error("Error fetching header menu:", error);
          return;
        }

        if (data && data.items) {
          setMenuItems(data.items);
        }
      } catch (err) {
        console.error("Error fetching header menu:", err);
      }
    };

    fetchHeaderMenu();
  }, [language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
    console.log("Search for:", searchQuery);
  };

  // Default menu items as fallback
  const defaultMenuItems: MenuItem[] = [
    {
      id: "1",
      title: "Electronics",
      url: "/category/electronics",
      children: [
        {
          id: "1-1",
          title: "Smartphones",
          url: "/category/electronics/smartphones",
        },
        { id: "1-2", title: "Laptops", url: "/category/electronics/laptops" },
        {
          id: "1-3",
          title: "Accessories",
          url: "/category/electronics/accessories",
        },
      ],
    },
    {
      id: "2",
      title: "Clothing",
      url: "/category/clothing",
      children: [
        { id: "2-1", title: "Men", url: "/category/clothing/men" },
        { id: "2-2", title: "Women", url: "/category/clothing/women" },
        { id: "2-3", title: "Kids", url: "/category/clothing/kids" },
      ],
    },
    {
      id: "3",
      title: "Home & Garden",
      url: "/category/home-garden",
      children: [
        {
          id: "3-1",
          title: "Furniture",
          url: "/category/home-garden/furniture",
        },
        { id: "3-2", title: "Decor", url: "/category/home-garden/decor" },
        { id: "3-3", title: "Kitchen", url: "/category/home-garden/kitchen" },
      ],
    },
    {
      id: "4",
      title: "Beauty",
      url: "/category/beauty",
      children: [
        { id: "4-1", title: "Skincare", url: "/category/beauty/skincare" },
        { id: "4-2", title: "Makeup", url: "/category/beauty/makeup" },
        { id: "4-3", title: "Fragrance", url: "/category/beauty/fragrance" },
      ],
    },
    {
      id: "5",
      title: "Promotions",
      url: "/promotions",
    },
  ];

  // Use fetched menu items or fallback to default
  const displayMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b shadow-sm",
        direction === "rtl" ? "direction-rtl" : "",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">
                E-Commerce CMS
              </span>
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
            <LanguageSwitcher />

            {/* User Account */}
            <Link to="/account" className="p-2">
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>

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
                        <div key={item.id}>
                          <Link
                            to={item.url}
                            className={`block py-2 hover:text-primary ${item.title === "Promotions" ? "text-red-500 font-medium" : ""}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.title}
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
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {/* CMS Link in Mobile Menu */}
                      <Link
                        to="/cms"
                        className="block py-2 hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        CMS Dashboard
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
