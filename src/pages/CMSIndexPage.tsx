import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cms } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";
import { FileText, Edit, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  locale: string;
}

const CMSIndexPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        const { data, error } = await cms.getPages(language);

        if (error) throw new Error(error.message);
        setPages(data || []);
      } catch (err: any) {
        console.error("Error fetching CMS pages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
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

  // If no real pages are available, show sample pages
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("cms.pages") || "CMS Pages"}</h1>
        <Button className="flex items-center gap-2">
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    <span>{t("common.edit") || "Edit"}</span>
                  </Button>
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
    </div>
  );
};

export default CMSIndexPage;
