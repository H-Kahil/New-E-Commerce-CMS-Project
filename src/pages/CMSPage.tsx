import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cms } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";

// Block components
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

interface CMSPageProps {
  edit?: boolean;
}

// Main CMS Page component
const CMSPage: React.FC<CMSPageProps> = ({ edit = false }) => {
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
        // Use the enhanced function to get page with sections and blocks
        const { data, error } = await cms.getPageWithSectionsAndBlocks(
          slug,
          language,
        );

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
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gray-50 py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {page.title || "Page Title"}
              </h1>
              {page.subtitle && (
                <p className="text-lg mt-2 text-gray-600">{page.subtitle}</p>
              )}
            </div>
            {edit && (
              <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-md">
                <p className="font-medium">Edit Mode</p>
                <p className="text-sm">
                  Editing functionality will be implemented in a future update.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render sections */}
      {page.sections?.map((section: any, index: number) => (
        <Section key={index} section={section} />
      ))}

      {/* If there's content directly on the page (legacy support) */}
      {page.content && (
        <div className="container mx-auto px-4 py-8">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSPage;
