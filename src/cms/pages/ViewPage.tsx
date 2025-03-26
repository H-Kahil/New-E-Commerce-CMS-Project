import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { cms } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

// Block components (imported from the original CMSPage.tsx)
const HeroBlock = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">
          {data.title || "Hero Title"}
        </h2>
        <p className="text-lg mb-6">{data.subtitle || ""}</p>
        {data.cta_text && data.cta_link && (
          <a
            href={data.cta_link}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            {data.cta_text}
          </a>
        )}
      </div>
      {data.background_image && (
        <img
          src={data.background_image}
          alt={data.title || "Hero Image"}
          className="w-full h-64 object-cover rounded-lg mt-6"
        />
      )}
    </div>
  );
};

const ProductGridBlock = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{data.title || "Products"}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.products?.map((product: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.title || `Product ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-medium">
                {product.title || `Product ${index + 1}`}
              </h3>
              <p className="text-sm text-gray-500">{product.price || ""}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PromoBannerBlock = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div
      className="bg-secondary/10 rounded-lg p-6 mb-8 text-center"
      style={
        data.background_color ? { backgroundColor: data.background_color } : {}
      }
    >
      <h3 className="text-xl font-bold mb-2">{data.title || "Promotion"}</h3>
      <p className="mb-4">{data.description || ""}</p>
      {data.cta_text && data.cta_link && (
        <a
          href={data.cta_link}
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
        >
          {data.cta_text}
        </a>
      )}
    </div>
  );
};

const AdZoneBlock = ({ data }: { data: any }) => {
  if (!data) return null;

  const [adData, setAdData] = useState<any>(null);
  const { language } = useRtl();

  useEffect(() => {
    const fetchAdZone = async () => {
      if (!data.location) return;

      try {
        const { data: adZone, error } = await cms.getAdZoneByLocation(
          data.location,
          language,
        );
        if (error) throw new Error(error.message);

        if (adZone && adZone.cms_ads && adZone.cms_ads.length > 0) {
          // Filter active ads
          const activeAds = adZone.cms_ads.filter((ad: any) => {
            if (!ad.is_active) return false;

            const now = new Date();
            if (ad.start_date && new Date(ad.start_date) > now) return false;
            if (ad.end_date && new Date(ad.end_date) < now) return false;

            return true;
          });

          if (activeAds.length > 0) {
            // For simplicity, just show the first active ad
            setAdData(activeAds[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching ad zone:", err);
      }
    };

    fetchAdZone();
  }, [data.location, language]);

  if (!adData) return null;

  return (
    <div className="mb-8">
      <a
        href={adData.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <img
          src={adData.image}
          alt={adData.title || "Advertisement"}
          className="w-full h-auto"
        />
      </a>
    </div>
  );
};

const TextBlock = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="prose max-w-none mb-8">
      <div dangerouslySetInnerHTML={{ __html: data.content || "" }} />
    </div>
  );
};

// Block renderer
const BlockRenderer = ({ block }: { block: any }) => {
  if (!block || !block.type) return null;

  switch (block.type) {
    case "hero":
      return <HeroBlock data={block.data} />;
    case "product_grid":
      return <ProductGridBlock data={block.data} />;
    case "promo_banner":
      return <PromoBannerBlock data={block.data} />;
    case "ad_zone":
      return <AdZoneBlock data={block.data} />;
    case "text":
      return <TextBlock data={block.data} />;
    default:
      return <div>Unknown block type: {block.type}</div>;
  }
};

// Section component
const Section = ({ section }: { section: any }) => {
  if (!section) return null;

  const sectionClasses = {
    full_width: "w-full",
    contained: "container mx-auto px-4",
    narrow: "max-w-3xl mx-auto px-4",
  }[section.width_type || "contained"];

  return (
    <section
      className={`py-8 ${sectionClasses}`}
      style={
        section.background_color
          ? { backgroundColor: section.background_color }
          : {}
      }
    >
      {section.title && (
        <h2 className="text-2xl font-bold mb-6 text-center">{section.title}</h2>
      )}
      {section.blocks?.map((block: any, index: number) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </section>
  );
};

const ViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        console.error("Error fetching CMS page:", err);
        setError(err.message || "Page not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, language]);

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
            {t("cms.pages.viewPage", "View Page")}: {page.title}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/cms/pages")}>
              {t("common.back", "Back")}
            </Button>
            <Button onClick={() => navigate(`/cms/pages/edit/${page.slug}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("common.edit", "Edit")}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-3xl font-bold">{page.title || "Page Title"}</h1>
            {page.subtitle && (
              <p className="text-lg mt-2 text-gray-600">{page.subtitle}</p>
            )}
          </div>

          {/* Preview notice */}
          <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">
            <p>
              {t(
                "cms.pages.previewNotice",
                "This is a preview of how the page will appear on your site.",
              )}
            </p>
          </div>

          {/* Render sections */}
          <div className="border rounded-lg overflow-hidden">
            {page.sections?.map((section: any, index: number) => (
              <Section key={index} section={section} />
            ))}

            {/* If there's content directly on the page (legacy support) */}
            {page.content && (
              <div className="p-6">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: page.content }} />
                </div>
              </div>
            )}

            {!page.sections?.length && !page.content && (
              <div className="p-6 text-center text-gray-500">
                {t(
                  "cms.pages.emptyPage",
                  "This page has no content or sections.",
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
