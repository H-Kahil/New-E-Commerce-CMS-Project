import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { cms } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CMSNavbar from "../components/CMSNavbar";

const CreatePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("New Page");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    if (!title) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    try {
      // Generate a slug if not provided
      const finalSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // Create a new page
      const { data, error } = await cms.createPage(
        {
          title,
          slug: finalSlug,
          content,
          sections: [],
        },
        language,
      );

      if (error) {
        console.error("Error creating page:", error);
        alert(`Failed to create page: ${error.message}`);
        return;
      }

      alert("Page created successfully!");
      // Redirect to the pages list
      navigate("/cms/pages");
    } catch (err: any) {
      console.error("Error creating page:", err);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.pages.createNew", "Create New Page")}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/cms/pages")}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading
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
                <span className="text-xs text-gray-500 ml-1">
                  (
                  {t(
                    "cms.pages.slugInfo",
                    "Leave empty to generate from title",
                  )}
                  )
                </span>
              </Label>
              <Input
                type="text"
                id="pageSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
          <h2 className="text-lg font-semibold mb-4">
            {t("cms.pages.sections", "Sections")}
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              {t("cms.pages.noSections", "No sections added yet")}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {t(
                "cms.pages.sectionsInfo",
                "You can add sections after saving the page",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
