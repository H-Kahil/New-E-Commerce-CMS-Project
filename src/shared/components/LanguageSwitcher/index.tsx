import React from "react";
import { useTranslation } from "react-i18next";
import { useRtl } from "../../../contexts/RtlContext";
import { Globe } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setDirection, setLanguage } = useRtl();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
    setDirection(newLang === "ar" ? "rtl" : "ltr");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-1"
      aria-label="Toggle language"
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm hidden md:inline">
        {i18n.language === "ar" ? "AR" : "EN"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
