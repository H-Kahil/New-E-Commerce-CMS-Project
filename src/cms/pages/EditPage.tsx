import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { cms } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CMSNavbar from "../components/CMSNavbar";

const EditPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Use the enhanced function to get page with sections and blocks
        const { data, error } = await cms.getPageWithSectionsAndBlocks(
          slug,
          language,
        );

        if (error) {
          console.error("Error fetching CMS page:", error);
          throw new Error("Page not found");
        }
        if (!data) throw new Error("Page not found");

        setPage(data);
        setTitle(data.title || "");
        setEditSlug(data.slug || "");
        setContent(data.content || "");
      } catch (err: any) {
        console.error("Error fetching CMS page:", err);
        setError(err.message || "Page not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, language]);

  const handleSave = async () => {
    if (!title) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      // Generate a slug if not provided
      const finalSlug =
        editSlug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // Update existing page
      const { data, error } = await cms.updatePage(
        slug || "",
        {
          title,
          slug: finalSlug,
          content,
        },
        language,
      );

      if (error) {
        console.error("Error updating page:", error);
        alert(`Failed to update page: ${error.message}`);
        return;
      }

      alert("Page updated successfully!");
      // Redirect to the view page if slug changed, otherwise stay on edit page
      if (finalSlug !== slug) {
        navigate(`/cms/pages/edit/${finalSlug}`);
      }
    } catch (err: any) {
      console.error("Error saving page:", err);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setSaving(false);
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

  if (error || !page) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {error || "Page not found"}
          </h1>
          <Button variant="outline" onClick={() => navigate("/cms/pages")}>
            {t("common.backToPages", "Back to Pages")}
          </Button>
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
            {t("cms.pages.editPage", "Edit Page")}: {page.title}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/cms/pages")}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? t("common.saving", "Saving...")
                : t("common.save", "Save")}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="pageTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("cms.pages.pageTitle", "Page Title")}
              </Label>
              <Input
                type="text"
                id="pageTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="pageSlug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("cms.pages.pageSlug", "Page Slug")}
              </Label>
              <Input
                type="text"
                id="pageSlug"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Label
            htmlFor="pageContent"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            {t("cms.pages.pageContent", "Page Content")}
          </Label>
          <Textarea
            id="pageContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {t("cms.pages.sections", "Sections")}
            </h2>
            <Button size="sm">
              {t("cms.pages.addSection", "Add Section")}
            </Button>
          </div>

          {page.sections && page.sections.length > 0 ? (
            <div className="space-y-4">
              {page.sections.map((section: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      {section.title || `Section ${index + 1}`}
                    </h3>
                    <Button variant="ghost" size="sm">
                      {t("common.edit", "Edit")}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t("cms.pages.type", "Type")}: {section.type || "Standard"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("cms.pages.blocks", "Blocks")}:{" "}
                    {section.blocks?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                {t("cms.pages.noSections", "No sections added yet")}
              </p>
              <Button className="mt-4">
                {t("cms.pages.addSection", "Add Section")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPage;
