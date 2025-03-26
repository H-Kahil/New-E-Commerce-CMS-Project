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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium">
                  {t("cms.menus.menuList", "Navigation Menus")}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("cms.menus.addMenu", "Add Menu")}
                </Button>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-500">
                  {t("cms.menus.noMenus", "No navigation menus created yet")}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {t(
                    "cms.menus.createMenuPrompt",
                    "Create your first navigation menu to organize your site structure",
                  )}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <h3 className="text-lg font-medium">
                  {t("cms.menus.menuItems", "Menu Items")}
                </h3>
                <Button size="sm" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("cms.menus.addItem", "Add Menu Item")}
                </Button>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-500">
                  {t("cms.menus.noItems", "No menu items available")}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {t(
                    "cms.menus.createItemPrompt",
                    "Create a menu first, then add items to it",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenusModule;
