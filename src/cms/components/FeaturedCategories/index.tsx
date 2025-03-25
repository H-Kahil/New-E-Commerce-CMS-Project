import React from "react";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { cn } from "@/shared/utils";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

interface FeaturedCategoriesProps {
  title?: string;
  titleAr?: string;
  categories?: Category[];
  locale?: "en" | "ar";
  viewAllLink?: string;
  className?: string;
}

const FeaturedCategories = ({
  title = "Shop by Category",
  titleAr = "تسوق حسب الفئة",
  categories = [
    {
      id: "1",
      name: "Electronics",
      nameAr: "إلكترونيات",
      slug: "electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
      productCount: 120,
    },
    {
      id: "2",
      name: "Clothing",
      nameAr: "ملابس",
      slug: "clothing",
      imageUrl:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
      productCount: 250,
    },
    {
      id: "3",
      name: "Home & Kitchen",
      nameAr: "المنزل والمطبخ",
      slug: "home-kitchen",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=500&q=80",
      productCount: 180,
    },
    {
      id: "4",
      name: "Beauty",
      nameAr: "الجمال",
      slug: "beauty",
      imageUrl:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
      productCount: 95,
    },
    {
      id: "5",
      name: "Sports",
      nameAr: "رياضة",
      slug: "sports",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80",
      productCount: 75,
    },
  ],
  locale = "en",
  viewAllLink = "/categories",
  className = "",
}: FeaturedCategoriesProps) => {
  const isRtl = locale === "ar";
  const displayTitle = isRtl ? titleAr : title;

  return (
    <section
      className={cn("w-full bg-white py-12", className)}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {displayTitle}
          </h2>
          <a
            href={viewAllLink}
            className="flex items-center text-sm font-medium text-primary hover:underline"
          >
            {isRtl ? "عرض الكل" : "View all categories"}
            <ArrowRight
              className={cn(
                "ml-1 h-4 w-4",
                isRtl && "rotate-180 transform mr-1 ml-0",
              )}
            />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={category.imageUrl}
                  alt={isRtl ? category.nameAr : category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900">
                  {isRtl ? category.nameAr : category.name}
                </h3>
              </CardContent>
              <CardFooter className="border-t p-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  {category.productCount} {isRtl ? "منتج" : "products"}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
