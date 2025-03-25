import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  currentLanguage?: "en" | "ar";
  onLanguageChange?: (language: "en" | "ar") => void;
}

const LanguageSwitcher = ({
  currentLanguage = "en",
  onLanguageChange = () => {},
}: LanguageSwitcherProps) => {
  const [language, setLanguage] = useState<"en" | "ar">(currentLanguage);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  return (
    <div className="flex items-center justify-center bg-white rounded-md p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn(
                "flex items-center gap-1 px-2 py-1 h-auto",
                language === "ar" ? "flex-row-reverse" : "",
              )}
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">
                {language === "en" ? "EN" : "AR"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {language === "en" ? "Switch to Arabic" : "Switch to English"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LanguageSwitcher;
