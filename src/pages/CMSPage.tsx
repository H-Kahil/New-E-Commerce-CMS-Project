import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cms } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";

// Placeholder component - will be expanded in future phases
const CMSPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const { data, error } = await cms.getPage(slug, language);

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Page not found");

        setPage(data);
      } catch (err: any) {
        console.error("Error fetching CMS page:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-64 bg-gray-200 rounded my-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Page not found"}
        </h1>
        <p className="mb-4">
          {t("common.page")} {slug} {t("common.notFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

      {page.featured_image && (
        <div className="mb-8">
          <img
            src={page.featured_image}
            alt={page.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none">
        {/* In a real implementation, you would use a rich text renderer here */}
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
};

export default CMSPage;
