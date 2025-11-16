"use client";

import { Globe, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { countryCodeMap } from "../../data/countryCodes";
import MobileThemeSelector from "./MobileThemeSelector";

interface MobileControlsProps {
  onCountryClick: () => void;
  onLanguageClick: () => void;
  countryCode: string;
}

export default function MobileControls({
  onCountryClick,
  onLanguageClick,
  countryCode,
}: MobileControlsProps) {
  const t = useTranslations("FloatingControls");
  const twoLetterCode = countryCodeMap[countryCode] ?? "";

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[--color-border] shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
      style={{
        backgroundColor: "var(--color-card)",
        backdropFilter: "none",
      }}
    >
      <div className="flex justify-around items-center h-16">
        <button
          onClick={onCountryClick}
          className="flex flex-col items-center gap-1 text-[--color-label] hover:text-[--color-title] border-none"
        >
          <span
            className={`fi fi-${twoLetterCode} w-6 h-4 rounded-sm`}
            title={t("changeCountry")}
          />
          <span className="text-xs font-semibold">{countryCode}</span>
        </button>

        <button
          onClick={onLanguageClick}
          className="flex flex-col items-center gap-1 text-[--color-label] hover:text-[--color-title] border-none"
        >
          <Languages size={20} />
          <span className="text-xs font-semibold">{t("language")}</span>
        </button>

        <MobileThemeSelector />
      </div>
    </div>
  );
}