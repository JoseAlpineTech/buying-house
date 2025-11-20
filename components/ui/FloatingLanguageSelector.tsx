"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { languages } from "../../data/languages";
import { usePathname, useRouter } from "../../navigation";

type Language = (typeof languages)[number];

export default function FloatingLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("FloatingControls");

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedLanguage =
    languages.find((lang) => lang.code === locale) ?? languages[0];

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

  const handleLanguageSelect = (lang: Language) => {
    const params = searchParams.toString();
    const query = params ? `?${params}` : "";
    router.push(pathname + query, { locale: lang.code });
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-col items-end"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-2xl hover:bg-[--color-border] transition-colors"
        title={t("changeLanguage")}
      >
        <span className="text-sm text-[--color-label]">
          {t("language")}
        </span>
        <span className="font-semibold text-[--color-title] pr-1">
          {selectedLanguage.nativeName}
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
            className="absolute z-50 mt-2 w-48 max-h-80 overflow-y-auto rounded-lg border border-[--color-border] shadow-2xl"
          >
            <ul className="p-2">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full p-2 rounded-md text-left transition-colors font-semibold ${
                      selectedLanguage.code === lang.code
                        ? "bg-[--color-accent]/20 text-[--color-title]"
                        : "text-[--color-text] hover:bg-[--color-border]/50"
                    }`}
                  >
                    {lang.nativeName}
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