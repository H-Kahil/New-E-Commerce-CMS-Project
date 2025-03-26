import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const ProductsModule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.products.title", "Products")}
          </h2>
          <Link to="/cms/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.products.createNew", "Create New Product")}
            </Button>
          </Link>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            {t("cms.products.comingSoon", "Product management coming soon")}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {t(
              "cms.products.description",
              "This module will allow you to manage your products, categories, and collections.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductsModule;
