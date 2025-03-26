import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FileText, ShoppingBag, Image, Menu } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const CMSDashboard: React.FC = () => {
  const { t } = useTranslation();

  const modules = [
    {
      title: t("cms.dashboard.pages", "Pages"),
      description: t(
        "cms.dashboard.pagesDescription",
        "Manage website pages and content",
      ),
      icon: <FileText className="h-8 w-8 text-primary" />,
      path: "/cms/pages",
    },
    {
      title: t("cms.dashboard.products", "Products"),
      description: t(
        "cms.dashboard.productsDescription",
        "Manage products and categories",
      ),
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      path: "/cms/products",
    },
    {
      title: t("cms.dashboard.ads", "Ad Management"),
      description: t(
        "cms.dashboard.adsDescription",
        "Manage ad zones and advertisements",
      ),
      icon: <Image className="h-8 w-8 text-primary" />,
      path: "/cms/ads",
    },
    {
      title: t("cms.dashboard.menus", "Menu Management"),
      description: t(
        "cms.dashboard.menusDescription",
        "Manage navigation menus",
      ),
      icon: <Menu className="h-8 w-8 text-primary" />,
      path: "/cms/menus",
    },
  ];

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {t("cms.dashboard.welcome", "Welcome to the CMS Dashboard")}
          </h2>
          <p className="text-gray-600">
            {t(
              "cms.dashboard.description",
              "Manage your website content, products, and more from this central dashboard.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link
              key={module.path}
              to={module.path}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{module.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-500 text-sm">{module.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("cms.dashboard.quickTips", "Quick Tips")}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              {t(
                "cms.dashboard.tip1",
                "Create new pages with custom layouts using the Pages module",
              )}
            </li>
            <li>
              {t(
                "cms.dashboard.tip2",
                "Manage your product catalog through the Products module",
              )}
            </li>
            <li>
              {t(
                "cms.dashboard.tip3",
                "Set up ad zones to display advertisements on your site",
              )}
            </li>
            <li>
              {t(
                "cms.dashboard.tip4",
                "Configure navigation menus to improve site usability",
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
