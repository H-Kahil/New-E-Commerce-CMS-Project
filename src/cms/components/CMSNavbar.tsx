import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CMSNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: "Pages", path: "/cms/pages" },
    { name: "Products", path: "/cms/products" },
    { name: "Ads", path: "/cms/ads" },
    { name: "Menus", path: "/cms/menus" },
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
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 mr-2 rounded-md whitespace-nowrap ${
                location.pathname.startsWith(item.path)
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMSNavbar;
