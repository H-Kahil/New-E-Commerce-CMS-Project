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
import { cn } from "@/shared/utils";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: string;
  children?: MenuItem[];
}

interface NavigationMenuProps {
  menuItems?: MenuItem[];
  className?: string;
}

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
      { id: "3-1", label: "Furniture", url: "/category/home-garden/furniture" },
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

const NavigationMenuComponent = ({
  menuItems = defaultMenuItems,
  className = "",
}: NavigationMenuProps) => {
  return (
    <div className={cn("bg-background w-full", className)}>
      <NavigationMenu className="mx-auto max-w-6xl">
        <NavigationMenuList>
          {menuItems.map((item) => (
            <NavigationMenuItem key={item.id}>
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={child.url}
                              target={child.target || "_self"}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {child.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Browse {child.label} in {item.label}
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
                    to={item.url}
                    target={item.target || "_self"}
                    className={`group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${item.label === "Promotions" ? "text-red-500" : ""}`}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavigationMenuComponent;
