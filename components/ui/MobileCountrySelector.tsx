"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { countryCodeMap } from "../../data/countryCodes";
import { countryDisplayNames } from "../../data/countryDisplayNames";

interface MobileCountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  countries: string[];
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

export default function MobileCountrySelector({
  isOpen,
  onClose,
  countries,
  selectedCountry,
  onSelect,
}: MobileCountrySelectorProps) {
  const t = useTranslations("FloatingControls");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(() => {
    return countries.filter((code) => {
      const name =
        countryDisplayNames[code as keyof typeof countryDisplayNames] ?? code;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [countries, searchTerm]);

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-[--color-bg]/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="w-full h-[90vh] mt-auto rounded-t-2xl border-t border-[--color-border] flex flex-col"
            style={{
              backgroundColor: "var(--color-card)",
              backdropFilter: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-[--color-border] flex-shrink-0">
              <h2 className="text-lg font-semibold text-[--color-title]">
                {t("changeCountry")}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-[--color-label] hover:text-[--color-title] border-none"
              >
                <X size={24} />
              </button>
            </header>

            {/* Search */}
            <div className="p-4 border-b border-[--color-border] flex-shrink-0">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-label]"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border border-[--color-border] rounded-lg pl-10 pr-4 py-2 text-[--color-text] focus:ring-2 focus:ring-[--color-accent] focus:outline-none"
                />
              </div>
            </div>

            {/* Country List */}
            <ul className="overflow-y-auto p-2 flex-grow">
              {filteredCountries.map((code) => (
                <li key={code}>
                  <button
                    onClick={() => handleSelect(code)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors border-none ${
                      selectedCountry === code
                        ? "bg-[--color-accent]/20 text-[--color-title]"
                        : "text-[--color-text] hover:bg-[--color-border]/50"
                    }`}
                  >
                    <span
                      className={`fi fi-${
                        countryCodeMap[code as keyof typeof countryCodeMap] ??
                        ""
                      } w-8 h-5 rounded-sm`}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}