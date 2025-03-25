import React, { useState } from "react";
import { cn } from "@/shared/utils";
import ProductCard from "../ProductCard";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Grid,
  List,
  SlidersHorizontal,
  Heart,
  Search,
  ShoppingCart,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  category: string;
  variants?: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    inventory: number;
  }[];
}

interface ProductGridProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showSorting?: boolean;
  showViewToggle?: boolean;
  showSearch?: boolean;
  columns?: 2 | 3 | 4;
  maxItems?: number;
  isLoading?: boolean;
  onAddToCart?: (id: string, quantity: number) => void;
  onAddToWishlist?: (id: string) => void;
}

const ProductGrid = ({
  products = [
    {
      id: "prod-001",
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-t-shirt",
      description:
        "High-quality cotton t-shirt with a comfortable fit and stylish design.",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      price: 29.99,
      compareAtPrice: 39.99,
      rating: 4.5,
      isNew: true,
      isOnSale: true,
      category: "Clothing",
    },
    {
      id: "prod-002",
      name: "Slim Fit Jeans",
      slug: "slim-fit-jeans",
      description:
        "Classic slim fit jeans that offer both style and comfort for everyday wear.",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
      price: 49.99,
      compareAtPrice: 69.99,
      rating: 4.2,
      isOnSale: true,
      category: "Clothing",
    },
    {
      id: "prod-003",
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description:
        "Premium wireless headphones with noise cancellation and long battery life.",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      price: 129.99,
      rating: 4.8,
      isFeatured: true,
      category: "Electronics",
    },
    {
      id: "prod-004",
      name: "Leather Wallet",
      slug: "leather-wallet",
      description:
        "Handcrafted genuine leather wallet with multiple card slots and coin pocket.",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
      price: 34.99,
      compareAtPrice: 44.99,
      rating: 4.3,
      isOnSale: true,
      category: "Accessories",
    },
    {
      id: "prod-005",
      name: "Smart Watch",
      slug: "smart-watch",
      description:
        "Feature-packed smartwatch with health tracking, notifications, and customizable faces.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      price: 199.99,
      rating: 4.6,
      isNew: true,
      isFeatured: true,
      category: "Electronics",
    },
    {
      id: "prod-006",
      name: "Running Shoes",
      slug: "running-shoes",
      description:
        "Lightweight and comfortable running shoes with superior cushioning and support.",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      price: 89.99,
      compareAtPrice: 109.99,
      rating: 4.7,
      isOnSale: true,
      category: "Footwear",
    },
  ],
  title = "Featured Products",
  subtitle = "Discover our most popular items",
  showFilters = true,
  showSorting = true,
  showViewToggle = true,
  showSearch = true,
  columns = 3,
  maxItems = 12,
  isLoading = false,
  onAddToCart = () => {},
  onAddToWishlist = () => {},
}: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter products based on search
  const filteredProducts = searchValue
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          product.category.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : products;

  // Limit products to maxItems
  const displayProducts = filteredProducts.slice(0, maxItems);

  return (
    <div className="w-full bg-gray-50">
      {/* Header section with title and subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
      )}

      {/* Search bar */}
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Controls bar */}
      {(showFilters || showSorting || showViewToggle) && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {showSorting && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showViewToggle && (
              <div className="flex items-center rounded-md border bg-white p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                  aria-label="List view"
                >
                  <List size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter panel - conditionally rendered */}
      {showFilters && filterOpen && (
        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <h3 className="mb-2 font-medium">Categories</h3>
              <div className="space-y-1">
                {[
                  "All",
                  "Clothing",
                  "Electronics",
                  "Accessories",
                  "Footwear",
                ].map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium">Price Range</h3>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="h-9 w-24" />
                <span>-</span>
                <Input type="number" placeholder="Max" className="h-9 w-24" />
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium">Rating</h3>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating}`}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="flex items-center text-sm"
                    >
                      {Array.from({ length: rating }).map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="ml-1">& Up</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium">Availability</h3>
              <div className="space-y-1">
                {["In Stock", "Out of Stock"].map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`status-${status}`} className="text-sm">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Clear All
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      )}

      {/* Products display */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[400px] animate-pulse rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      ) : displayProducts.length > 0 ? (
        viewMode === "grid" ? (
          <div
            className={cn(
              "grid gap-4",
              columns === 2 && "grid-cols-1 sm:grid-cols-2",
              columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              columns === 4 &&
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                description={product.description}
                image={product.image}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                rating={product.rating}
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                isOnSale={product.isOnSale}
                category={product.category}
                variants={product.variants}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm sm:flex-row"
              >
                <div className="relative h-48 w-full sm:h-auto sm:w-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {product.isNew && (
                    <span className="absolute left-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                  {product.isOnSale && product.compareAtPrice && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                      {Math.round(
                        ((product.compareAtPrice - product.price) /
                          product.compareAtPrice) *
                          100,
                      )}
                      % Off
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      <svg
                        className="mr-1 h-4 w-4 fill-amber-400 text-amber-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="mb-1 text-lg font-medium">{product.name}</h3>
                  <p className="mb-4 flex-1 text-sm text-gray-600">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddToWishlist(product.id)}
                      >
                        <Heart size={16} className="mr-2" />
                        Wishlist
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(product.id, 1)}
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="my-12 text-center">
          <p className="text-lg text-gray-500">
            No products found matching your search.
          </p>
          {searchValue && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchValue("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Show more button if there are more products than maxItems */}
      {filteredProducts.length > maxItems && (
        <div className="mt-8 text-center">
          <Button variant="outline">Show More Products</Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
