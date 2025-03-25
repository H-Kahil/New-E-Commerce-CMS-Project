import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
}

interface ProductCardProps {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  price?: number;
  compareAtPrice?: number;
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  variants?: ProductVariant[];
  category?: string;
  onAddToCart?: (id: string, quantity: number) => void;
  onAddToWishlist?: (id: string) => void;
}

const ProductCard = ({
  id = "prod-001",
  name = "Premium Cotton T-Shirt",
  slug = "premium-cotton-t-shirt",
  description = "High-quality cotton t-shirt with a comfortable fit and stylish design.",
  image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  price = 29.99,
  compareAtPrice = 39.99,
  rating = 4.5,
  isNew = false,
  isFeatured = false,
  isOnSale = true,
  variants = [
    {
      id: "var-001",
      name: "Small",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 10,
    },
    {
      id: "var-002",
      name: "Medium",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 15,
    },
    {
      id: "var-003",
      name: "Large",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 8,
    },
  ],
  category = "Clothing",
  onAddToCart = () => {},
  onAddToWishlist = () => {},
}: ProductCardProps) => {
  const discountPercentage = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg bg-white">
      <div className="relative">
        {/* Product badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {isNew && <Badge className="bg-blue-500">New</Badge>}
          {isFeatured && <Badge className="bg-purple-500">Featured</Badge>}
          {isOnSale && (
            <Badge className="bg-red-500">{discountPercentage}% Off</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => onAddToWishlist(id)}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 text-gray-700 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>

        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{category}</p>
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <h3 className="mt-1 line-clamp-1 text-lg font-medium">{name}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className="mt-3 flex items-center">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onAddToCart(id, 1)}
                className="w-full gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add this product to your cart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
