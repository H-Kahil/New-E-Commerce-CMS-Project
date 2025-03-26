import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const AdsModule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.ads.title", "Ad Management")}
          </h2>
          <Link to="/cms/ads/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.ads.createNew", "Create New Ad")}
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-lg font-medium">
                  {t("cms.ads.adZones", "Ad Zones")}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("cms.ads.addZone", "Add Zone")}
                </Button>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-500">
                  {t("cms.ads.noZones", "No ad zones created yet")}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {t(
                    "cms.ads.createZonePrompt",
                    "Create your first ad zone to start managing advertisements",
                  )}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <h3 className="text-lg font-medium">
                  {t("cms.ads.advertisements", "Advertisements")}
                </h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("cms.ads.addAd", "Add Advertisement")}
                </Button>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-500">
                  {t("cms.ads.noAds", "No advertisements created yet")}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {t(
                    "cms.ads.createAdPrompt",
                    "Create your first advertisement to display in your ad zones",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsModule;
