import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductGrid from "./ProductGrid";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  attributes: {
    [key: string]: string;
  };
}

interface ProductDetailProps {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  longDescription?: string;
  images?: ProductImage[];
  price?: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  variants?: ProductVariant[];
  category?: string;
  attributes?: {
    [key: string]: string[];
  };
  relatedProducts?: any[];
  onAddToCart?: (id: string, variantId: string, quantity: number) => void;
  onAddToWishlist?: (id: string) => void;
}

const ProductDetail = ({
  id = "prod-001",
  name = "Premium Cotton T-Shirt",
  slug = "premium-cotton-t-shirt",
  description = "High-quality cotton t-shirt with a comfortable fit and stylish design.",
  longDescription = "<p>This premium cotton t-shirt is crafted from 100% organic cotton, providing exceptional comfort and durability. The classic fit makes it versatile for any occasion, while the reinforced stitching ensures it will last through countless washes.</p><p>Our sustainable manufacturing process uses 50% less water than conventional methods, making this not just a stylish choice, but an environmentally conscious one too.</p>",
  images = [
    {
      id: "img-001",
      url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=90",
      alt: "Premium Cotton T-Shirt front view",
      isPrimary: true,
    },
    {
      id: "img-002",
      url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=90",
      alt: "Premium Cotton T-Shirt back view",
    },
    {
      id: "img-003",
      url: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800&q=90",
      alt: "Premium Cotton T-Shirt worn by model",
    },
    {
      id: "img-004",
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90",
      alt: "Premium Cotton T-Shirt detail view",
    },
  ],
  price = 29.99,
  compareAtPrice = 39.99,
  rating = 4.5,
  reviewCount = 127,
  isNew = true,
  isFeatured = false,
  isOnSale = true,
  variants = [
    {
      id: "var-001",
      name: "Small / White",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 10,
      attributes: {
        size: "Small",
        color: "White",
      },
    },
    {
      id: "var-002",
      name: "Medium / White",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 15,
      attributes: {
        size: "Medium",
        color: "White",
      },
    },
    {
      id: "var-003",
      name: "Large / White",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 8,
      attributes: {
        size: "Large",
        color: "White",
      },
    },
    {
      id: "var-004",
      name: "Small / Black",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 12,
      attributes: {
        size: "Small",
        color: "Black",
      },
    },
    {
      id: "var-005",
      name: "Medium / Black",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 18,
      attributes: {
        size: "Medium",
        color: "Black",
      },
    },
    {
      id: "var-006",
      name: "Large / Black",
      price: 29.99,
      compareAtPrice: 39.99,
      inventory: 6,
      attributes: {
        size: "Large",
        color: "Black",
      },
    },
  ],
  category = "Clothing",
  attributes = {
    size: ["Small", "Medium", "Large"],
    color: ["White", "Black"],
    material: ["100% Cotton"],
    fit: ["Regular"],
  },
  relatedProducts = [
    {
      id: "prod-002",
      name: "Slim Fit Jeans",
      slug: "slim-fit-jeans",
      description:
        "Classic slim fit jeans that offer both style and comfort for everyday wear.",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=90",
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
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=90",
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
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&q=90",
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
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=90",
      price: 199.99,
      rating: 4.6,
      isNew: true,
      isFeatured: true,
      category: "Electronics",
    },
  ],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
}: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.isPrimary)?.id || images[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>(
    Object.keys(attributes || {}).reduce(
      (acc, key) => {
        acc[key] = attributes?.[key][0] || "";
        return acc;
      },
      {} as { [key: string]: string },
    ),
  );

  // Extract unique attribute values
  const uniqueAttributes = Object.keys(attributes || {}).reduce(
    (acc, key) => {
      acc[key] = [...new Set(variants.map((v) => v.attributes[key]))].filter(
        Boolean,
      );
      return acc;
    },
    {} as { [key: string]: string[] },
  );

  // Find matching variant based on selected attributes
  const findMatchingVariant = (attrs: { [key: string]: string }) => {
    return variants.find((variant) => {
      return Object.keys(attrs).every(
        (key) => variant.attributes[key] === attrs[key],
      );
    });
  };

  // Handle attribute selection
  const handleAttributeChange = (attributeKey: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeKey]: value };
    setSelectedAttributes(newAttributes);

    const matchingVariant = findMatchingVariant(newAttributes);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Calculate discount percentage
  const discountPercentage = selectedVariant.compareAtPrice
    ? Math.round(
        ((selectedVariant.compareAtPrice - selectedVariant.price) /
          selectedVariant.compareAtPrice) *
          100,
      )
    : 0;

  // Handle quantity changes
  const incrementQuantity = () => {
    if (quantity < selectedVariant.inventory) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md">
              <img
                src={
                  images.find((img) => img.id === selectedImage)?.url ||
                  images[0]?.url
                }
                alt={
                  images.find((img) => img.id === selectedImage)?.alt || name
                }
                className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.id)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-md border-2",
                    selectedImage === image.id
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300",
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Product badges */}
            <div className="flex flex-wrap gap-2">
              {isNew && <Badge className="bg-blue-500">New</Badge>}
              {isFeatured && <Badge className="bg-purple-500">Featured</Badge>}
              {isOnSale && (
                <Badge className="bg-red-500">{discountPercentage}% Off</Badge>
              )}
              <Badge variant="outline" className="text-gray-500">
                {category}
              </Badge>
            </div>

            {/* Product title and rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(rating)
                          ? "fill-amber-400 text-amber-400"
                          : i < rating
                            ? "fill-amber-400/50 text-amber-400"
                            : "fill-gray-200 text-gray-200",
                      )}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                ${selectedVariant.price.toFixed(2)}
              </span>
              {selectedVariant.compareAtPrice &&
                selectedVariant.compareAtPrice > selectedVariant.price && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${selectedVariant.compareAtPrice.toFixed(2)}
                  </span>
                )}
            </div>

            {/* Short description */}
            <p className="text-gray-600">{description}</p>

            {/* Variant selection */}
            <div className="space-y-4">
              {Object.keys(uniqueAttributes).map((attributeKey) => (
                <div key={attributeKey}>
                  <h3 className="mb-2 font-medium capitalize">
                    {attributeKey}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueAttributes[attributeKey].map((value) => {
                      const isColorAttribute =
                        attributeKey.toLowerCase() === "color";
                      return isColorAttribute ? (
                        <button
                          key={value}
                          onClick={() =>
                            handleAttributeChange(attributeKey, value)
                          }
                          className={cn(
                            "h-8 w-8 rounded-full border-2",
                            selectedAttributes[attributeKey] === value
                              ? "border-primary ring-2 ring-primary ring-offset-1"
                              : "border-gray-300",
                          )}
                          style={{ backgroundColor: value.toLowerCase() }}
                          title={value}
                          aria-label={`Select ${value} color`}
                        />
                      ) : (
                        <button
                          key={value}
                          onClick={() =>
                            handleAttributeChange(attributeKey, value)
                          }
                          className={cn(
                            "rounded-md border px-3 py-1 text-sm",
                            selectedAttributes[attributeKey] === value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity selector */}
            <div>
              <h3 className="mb-2 font-medium">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant.inventory}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        parseInt(e.target.value) || 1,
                        selectedVariant.inventory,
                      ),
                    )
                  }
                  className="h-8 w-12 border border-gray-300 text-center"
                />
                <button
                  onClick={incrementQuantity}
                  className="flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  disabled={quantity >= selectedVariant.inventory}
                >
                  +
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {selectedVariant.inventory} available
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onAddToCart(id, selectedVariant.id, quantity)}
                className="flex-1 gap-2"
                size="lg"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11"
                      onClick={() => onAddToWishlist(id)}
                    >
                      <Heart size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-11 w-11">
                      <Share2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share Product</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Product features */}
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <span className="text-sm">Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <span className="text-sm">2-year warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-gray-600" />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gray-600" />
                <span className="text-sm">Loyalty rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product details tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: longDescription }} />
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(attributes || {}).map(([key, values]) => (
                      <tr key={key}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                          {key}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {values.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Reviews will be loaded from the database.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>
                  We offer free standard shipping on all orders over $50. For
                  orders under $50, standard shipping costs $4.99.
                </p>
                <p>Estimated delivery times:</p>
                <ul>
                  <li>Standard Shipping: 3-5 business days</li>
                  <li>
                    Express Shipping: 1-2 business days (additional $9.99)
                  </li>
                </ul>

                <h3>Return Policy</h3>
                <p>
                  We accept returns within 30 days of delivery for a full refund
                  or exchange. Items must be unused and in their original
                  packaging.
                </p>
                <p>
                  To initiate a return, please contact our customer service team
                  or visit your order history in your account.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <ProductGrid
            products={relatedProducts}
            showFilters={false}
            showSorting={false}
            columns={4}
            maxItems={4}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
