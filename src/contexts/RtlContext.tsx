import React, { createContext, useContext, useState, ReactNode } from "react";

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

export const useRtl = () => {
  const context = useContext(RtlContext);
  if (!context) {
    throw new Error("useRtl must be used within a RtlProvider");
  }
  return context;
};

interface RtlProviderProps {
  children: ReactNode;
  initialDirection?: Direction;
  initialLanguage?: Language;
}

export const RtlProvider: React.FC<RtlProviderProps> = ({
  children,
  initialDirection = "ltr",
  initialLanguage = "en",
}) => {
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const toggleDirection = () => {
    setDirection(direction === "ltr" ? "rtl" : "ltr");
    setLanguage(language === "en" ? "ar" : "en");
  };

  const value = {
    direction,
    language,
    setDirection,
    setLanguage,
    toggleDirection,
  };

  return <RtlContext.Provider value={value}>{children}</RtlContext.Provider>;
};
