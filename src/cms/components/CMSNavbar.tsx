import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ShoppingBag, Image, Menu, Home } from "lucide-react";

const CMSNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/cms",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Pages",
      path: "/cms/pages",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "Products",
      path: "/cms/products",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
    {
      name: "Categories",
      path: "/cms/categories",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    { name: "Ads", path: "/cms/ads", icon: <Image className="h-4 w-4 mr-2" /> },
    {
      name: "Menus",
      path: "/cms/menus",
      icon: <Menu className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">CMS Dashboard</h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Site
            </Button>
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={
                location.pathname === item.path ||
                (item.path !== "/cms" &&
                  location.pathname.startsWith(item.path))
                  ? "default"
                  : "ghost"
              }
              className="mr-2 whitespace-nowrap"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMSNavbar;
