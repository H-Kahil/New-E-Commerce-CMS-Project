import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const MenusModule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.menus.title", "Menu Management")}
          </h2>
          <Link to="/cms/menus/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.menus.createNew", "Create New Menu")}
            </Button>
          </Link>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            {t("cms.menus.comingSoon", "Menu management coming soon")}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {t(
              "cms.menus.description",
              "This module will allow you to manage your navigation menus and links.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenusModule;
