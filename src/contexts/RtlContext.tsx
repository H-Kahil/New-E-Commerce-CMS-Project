import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

type Direction = "ltr" | "rtl";
type Language = "en" | "ar";

interface RtlContextType {
  direction: Direction;
  language: Language;
  setDirection: (direction: Direction) => void;
  setLanguage: (language: Language) => void;
  toggleDirection: () => void;
}

const RtlContext = createContext<RtlContextType | undefined>(undefined);

// Export as a named function declaration
export function useRtl() {
  const context = useContext(RtlContext);
  if (!context) {
    throw new Error("useRtl must be used within a RtlProvider");
  }
  return context;
}

interface RtlProviderProps {
  children: ReactNode;
}

// Export as a named function declaration (same style as useRtl)
export function RtlProvider({ children }: RtlProviderProps) {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<Direction>("ltr");
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Initialize based on i18n language
    const currentLang = i18n.language as Language;
    if (currentLang === "ar" || currentLang === "en") {
      setLanguage(currentLang);
      setDirection(currentLang === "ar" ? "rtl" : "ltr");
    }
  }, [i18n.language]);

  useEffect(() => {
    // Update document direction when direction changes
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const toggleDirection = () => {
    const newDirection = direction === "ltr" ? "rtl" : "ltr";
    const newLanguage = language === "en" ? "ar" : "en";
    setDirection(newDirection);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const value = {
    direction,
    language,
    setDirection,
    setLanguage,
    toggleDirection,
  };

  return <RtlContext.Provider value={value}>{children}</RtlContext.Provider>;
}
