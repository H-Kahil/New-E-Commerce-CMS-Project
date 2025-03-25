import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

interface NavigationMenuProps {
  categories?: Category[];
  className?: string;
}

const NavigationMenuComponent = ({
  categories = [
    {
      id: "1",
      name: "Electronics",
      slug: "electronics",
      subcategories: [
        { id: "1-1", name: "Smartphones", slug: "smartphones" },
        { id: "1-2", name: "Laptops", slug: "laptops" },
        { id: "1-3", name: "Accessories", slug: "accessories" },
      ],
    },
    {
      id: "2",
      name: "Clothing",
      slug: "clothing",
      subcategories: [
        { id: "2-1", name: "Men", slug: "men" },
        { id: "2-2", name: "Women", slug: "women" },
        { id: "2-3", name: "Kids", slug: "kids" },
      ],
    },
    {
      id: "3",
      name: "Home & Garden",
      slug: "home-garden",
      subcategories: [
        { id: "3-1", name: "Furniture", slug: "furniture" },
        { id: "3-2", name: "Decor", slug: "decor" },
        { id: "3-3", name: "Kitchen", slug: "kitchen" },
      ],
    },
    {
      id: "4",
      name: "Beauty",
      slug: "beauty",
      subcategories: [
        { id: "4-1", name: "Skincare", slug: "skincare" },
        { id: "4-2", name: "Makeup", slug: "makeup" },
        { id: "4-3", name: "Fragrance", slug: "fragrance" },
      ],
    },
  ],
  className = "",
}: NavigationMenuProps) => {
  return (
    <div className={cn("bg-background w-full", className)}>
      <NavigationMenu className="mx-auto max-w-6xl">
        <NavigationMenuList>
          {categories.map((category) => (
            <NavigationMenuItem key={category.id}>
              {category.subcategories && category.subcategories.length > 0 ? (
                <>
                  <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/category/${category.slug}/${subcategory.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {subcategory.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Browse {subcategory.name} in {category.name}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  >
                    {category.name}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/promotions"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                <span className="text-red-500 font-semibold">Promotions</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavigationMenuComponent;
