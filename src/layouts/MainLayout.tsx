import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "../contexts/RtlContext";

// Components
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";
import { cms } from "../services/supabase";

interface AdZone {
  id: string;
  location: string;
  title?: string;
  cms_ads: {
    id: string;
    title: string;
    image: string;
    link: string;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
  }[];
}

const AdComponent = ({ adZone }: { adZone: AdZone }) => {
  // Filter active ads (is_active is true and current date is between start_date and end_date if they exist)
  const activeAds = adZone.cms_ads.filter((ad) => {
    if (!ad.is_active) return false;

    const now = new Date();
    if (ad.start_date && new Date(ad.start_date) > now) return false;
    if (ad.end_date && new Date(ad.end_date) < now) return false;

    return true;
  });

  // If no active ads, don't render anything
  if (activeAds.length === 0) return null;

  // For simplicity, just show the first active ad
  const ad = activeAds[0];

  return (
    <div className="w-full py-2">
      <div className="container mx-auto px-4">
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-auto object-cover"
          />
        </a>
      </div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const { direction, language } = useRtl();
  const [adZones, setAdZones] = useState<Record<string, AdZone>>({});

  useEffect(() => {
    const fetchAdZones = async () => {
      try {
        const { data, error } = await cms.getAdZones(language);
        if (error) throw new Error(error.message);

        if (data) {
          // Convert array to object with location as key for easier access
          const adZonesMap = data.reduce(
            (acc: Record<string, AdZone>, zone: AdZone) => {
              acc[zone.location] = zone;
              return acc;
            },
            {},
          );

          setAdZones(adZonesMap);
        }
      } catch (err) {
        console.error("Error fetching ad zones:", err);
      }
    };

    fetchAdZones();
  }, [language]);

  return (
    <div className="flex min-h-screen flex-col bg-white" dir={direction}>
      <Header />

      {/* Top ad zone */}
      {adZones["site-top"] && <AdComponent adZone={adZones["site-top"]} />}

      <main className="flex-1">
        {/* Before content ad zone */}
        {adZones["content-top"] && (
          <AdComponent adZone={adZones["content-top"]} />
        )}

        <Outlet />

        {/* After content ad zone */}
        {adZones["content-bottom"] && (
          <AdComponent adZone={adZones["content-bottom"]} />
        )}
      </main>

      {/* Before footer ad zone */}
      {adZones["before-footer"] && (
        <AdComponent adZone={adZones["before-footer"]} />
      )}

      <Footer />
    </div>
  );
};

export default MainLayout;
