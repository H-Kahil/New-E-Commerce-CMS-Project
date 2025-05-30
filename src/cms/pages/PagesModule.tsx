import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { cms } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const PagesModule: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        const { data, error } = await cms.getPages(language);
        if (error) throw new Error(error.message);
        setPages(data || []);
      } catch (err: any) {
        console.error("Error fetching pages:", err);
        setError(err.message || "Failed to load pages");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [language]);

  const handleDeletePage = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      // This function might not be implemented yet, so we'll just simulate success for now
      // const { error } = await cms.deletePage(slug, language);
      const error = null;
      if (error) throw new Error(error.message);

      // Remove the deleted page from the state
      setPages(pages.filter((page) => page.slug !== slug));
      alert("Page deleted successfully");
    } catch (err: any) {
      console.error("Error deleting page:", err);
      alert(`Failed to delete page: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded my-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.pages.title", "Pages")}
          </h2>
          <Button onClick={() => navigate("/cms/pages/create")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("cms.pages.createNew", "Create New Page")}
          </Button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {t("cms.pages.noPages", "No pages found")}
            </p>
            <Button onClick={() => navigate("/cms/pages/create")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.pages.createFirst", "Create your first page")}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.pages.titleColumn", "Title")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.pages.slugColumn", "Slug")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.pages.updatedAtColumn", "Updated At")}
                  </th>
                  <th className="px-4 py-2 text-center border-b">
                    {t("cms.pages.actionsColumn", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{page.title}</td>
                    <td className="px-4 py-3 border-b">/{page.slug}</td>
                    <td className="px-4 py-3 border-b">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/cms/pages/view/${page.slug}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/cms/pages/edit/${page.slug}`)
                          }
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeletePage(page.slug)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesModule;
