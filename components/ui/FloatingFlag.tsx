"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { countryCodeMap } from "../../data/countryCodes";
import { countryDisplayNames } from "../../data/countryDisplayNames";

interface FloatingFlagProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: string[];
}

export default function FloatingFlag({
  selectedCountry,
  setSelectedCountry,
  countries,
}: FloatingFlagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("FloatingControls");
  const twoLetterCode = countryCodeMap[selectedCountry] ?? "";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedCountryName =
    countryDisplayNames[
      selectedCountry as keyof typeof countryDisplayNames
    ] ?? selectedCountry;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-2xl hover:bg-[--color-border] transition-colors"
        title={t("changeCountry")}
      >
        <span className="text-sm text-[--color-label]">{t("viewing")}</span>
        <span
          className={`fi fi-${twoLetterCode} w-8 h-5 rounded-sm`}
          title={t("flagOf", { countryName: selectedCountryName })}
        />
        <span className="font-semibold text-[--color-title] pr-2">
          {selectedCountryName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              backgroundColor: "var(--color-card)",
              backdropFilter: "none",
            }}
            className="absolute z-50 mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border border-[--color-border] shadow-2xl"
          >
            <ul className="p-2">
              {countries.map((code) => (
                <li key={code}>
                  <button
                    onClick={() => handleCountrySelect(code)}
                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                      selectedCountry === code
                        ? "bg-[--color-accent]/20 text-[--color-title]"
                        : "text-[--color-text] hover:bg-[--color-border]/50"
                    }`}
                  >
                    <span
                      className={`fi fi-${
                        countryCodeMap[
                          code as keyof typeof countryCodeMap
                        ] ?? ""
                      } w-6 h-4 rounded-sm`}
                    />
                    <span className="font-semibold">
                      {countryDisplayNames[
                        code as keyof typeof countryDisplayNames
                      ] ?? code}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
