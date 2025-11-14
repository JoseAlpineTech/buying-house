"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const twoLetterCode = countryCodeMap[selectedCountry] ?? "";
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
  }, [wrapperRef]);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed top-6 right-6 z-50 flex flex-col items-end"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-2xl hover:bg-[--color-border] transition-colors"
        title="Change Country"
      >
        <span className="text-sm text-[--color-label]">Viewing:</span>
        <span
          className={`fi fi-${twoLetterCode} w-8 h-5 rounded-sm`}
          title={`Flag of ${
            countryDisplayNames[
              selectedCountry as keyof typeof countryDisplayNames
            ]
          }`}
        />
        <span className="font-semibold text-[--color-title] pr-2">
          {
            countryDisplayNames[
              selectedCountry as keyof typeof countryDisplayNames
            ]
          }
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border border-[--color-border] shadow-2xl bg-[--color-card]/95 backdrop-blur-lg"
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
                      className={`fi fi-${countryCodeMap[code as keyof typeof countryCodeMap] ?? ""} w-6 h-4 rounded-sm`}
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