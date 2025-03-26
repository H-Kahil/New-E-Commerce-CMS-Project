import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cms, products } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";
import {
  FileText,
  Edit,
  Eye,
  ArrowRight,
  LayoutGrid,
  Image,
  Menu,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  locale: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  locale: string;
}

interface AdZone {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  locale: string;
}

interface Menu {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  locale: string;
}

const CMSIndexPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [adZones, setAdZones] = useState<AdZone[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pages");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch pages
        const { data: pagesData, error: pagesError } =
          await cms.getPages(language);
        if (pagesError) {
          console.error("Error fetching pages:", pagesError);
          // Continue with other requests instead of throwing
        }
        setPages(pagesData || []);

        // Fetch products
        const { data: productsData, error: productsError } =
          await products.getProducts({ locale: language, limit: 100 });
        if (productsError) {
          console.error("Error fetching products:", productsError);
          // Continue with other requests instead of throwing
        }
        setProductsList(productsData || []);

        // Fetch ad zones
        const { data: adZonesData, error: adZonesError } =
          await cms.getAdZones(language);
        if (adZonesError) {
          console.error("Error fetching ad zones:", adZonesError);
          // Continue with other requests instead of throwing
        }
        setAdZones(adZonesData || []);

        // Fetch menus
        const { data: menusData, error: menusError } =
          await cms.getMenus(language);
        if (menusError) {
          console.error("Error fetching menus:", menusError);
          // Log the error details for debugging
          console.log("Menu error details:", JSON.stringify(menusError));
          // Continue with other requests instead of throwing
        }
        setMenus(menusData || []);
      } catch (err: any) {
        console.error("Error fetching CMS data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <p className="mb-4">{t("common.errorOccurred")}</p>
      </div>
    );
  }

  // Sample data if real data is not available
  const displayPages =
    pages.length > 0
      ? pages
      : [
          {
            id: "1",
            title: "Home Page",
            slug: "home",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "2",
            title: "About Us",
            slug: "about",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "3",
            title: "Contact Us",
            slug: "contact",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "4",
            title: "FAQ Page",
            slug: "faq",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "5",
            title: "Terms & Conditions",
            slug: "terms",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "6",
            title: "Privacy Policy",
            slug: "privacy",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
        ];

  const displayProducts =
    productsList.length > 0
      ? productsList
      : [
          {
            id: "1",
            title: "Product 1",
            slug: "product-1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "2",
            title: "Product 2",
            slug: "product-2",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "3",
            title: "Product 3",
            slug: "product-3",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
        ];

  const displayAdZones =
    adZones.length > 0
      ? adZones
      : [
          {
            id: "1",
            name: "Header Banner",
            location: "header",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "2",
            name: "Sidebar Ad",
            location: "sidebar",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "3",
            name: "Footer Banner",
            location: "footer",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
        ];

  const displayMenus =
    menus.length > 0
      ? menus
      : [
          {
            id: "1",
            name: "Main Navigation",
            location: "header",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "2",
            name: "Footer Links",
            location: "footer",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
          {
            id: "3",
            name: "Mobile Menu",
            location: "mobile",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            locale: language,
          },
        ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {t("cms.dashboard") || "CMS Dashboard"}
        </h1>
      </div>

      <Tabs
        defaultValue="pages"
        className="w-full mb-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText size={16} />
            {t("cms.pages") || "Pages"}
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Tag size={16} />
            {t("cms.products") || "Products"}
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Image size={16} />
            {t("cms.adManagement") || "Ad Management"}
          </TabsTrigger>
          <TabsTrigger value="menus" className="flex items-center gap-2">
            <Menu size={16} />
            {t("cms.menuBuilder") || "Menu Builder"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {t("cms.pages") || "Pages"}
            </h2>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                alert(
                  "Create New Page functionality will be implemented in a future update.",
                );
              }}
            >
              <FileText size={16} />
              {t("cms.createNewPage") || "Create New Page"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
                  <p className="text-gray-500 text-sm mb-4">/{page.slug}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Link to={`/cms/page/edit/${page.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit size={14} />
                          <span>{t("common.edit") || "Edit"}</span>
                        </Button>
                      </Link>
                      <Link to={`/cms/page/${page.slug}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{t("common.view") || "View"}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {t("cms.products") || "Products"}
            </h2>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                alert(
                  "Create New Product functionality will be implemented in a future update.",
                );
              }}
            >
              <Tag size={16} />
              {t("cms.createNewProduct") || "Create New Product"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">/{product.slug}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          alert(
                            "Edit Product functionality will be implemented in a future update.",
                          );
                        }}
                      >
                        <Edit size={14} />
                        <span>{t("common.edit") || "Edit"}</span>
                      </Button>
                      <Link to={`/product/${product.slug}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{t("common.view") || "View"}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ads" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {t("cms.adManagement") || "Ad Management"}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  alert(
                    "Create Ad Zone functionality will be implemented in a future update.",
                  );
                }}
              >
                <LayoutGrid size={16} />
                {t("cms.createAdZone") || "Create Ad Zone"}
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  alert(
                    "Create New Ad functionality will be implemented in a future update.",
                  );
                }}
              >
                <Image size={16} />
                {t("cms.createNewAd") || "Create New Ad"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAdZones.map((zone) => (
              <div
                key={zone.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{zone.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    Location: {zone.location}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(zone.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          alert(
                            "Edit Ad Zone functionality will be implemented in a future update.",
                          );
                        }}
                      >
                        <Edit size={14} />
                        <span>{t("common.edit") || "Edit"}</span>
                      </Button>
                      <Link to={`/cms/ads/${zone.id}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{t("common.view") || "View"}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menus" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {t("cms.menuBuilder") || "Menu Builder"}
            </h2>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                alert(
                  "Create New Menu functionality will be implemented in a future update.",
                );
              }}
            >
              <Menu size={16} />
              {t("cms.createNewMenu") || "Create New Menu"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMenus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{menu.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    Location: {menu.location}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(menu.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          alert(
                            "Edit Menu functionality will be implemented in a future update.",
                          );
                        }}
                      >
                        <Edit size={14} />
                        <span>{t("common.edit") || "Edit"}</span>
                      </Button>
                      <Link to={`/cms/menus/${menu.id}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{t("common.view") || "View"}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSIndexPage;
