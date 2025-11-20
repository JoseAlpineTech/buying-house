"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { languages } from "../../data/languages";
import { usePathname, useRouter } from "../../navigation";

type Language = (typeof languages)[number];

interface MobileLanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileLanguageSelector({
  isOpen,
  onClose,
}: MobileLanguageSelectorProps) {
  const t = useTranslations("FloatingControls");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedLanguage =
    languages.find((lang) => lang.code === locale) ?? languages[0];

  const handleSelect = (lang: Language) => {
    const params = searchParams.toString();
    const query = params ? `?${params}` : "";
    router.push(pathname + query, { locale: lang.code });
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
            className="w-full mt-auto rounded-t-2xl border-t border-[--color-border] flex flex-col max-h-[50vh]"
            style={{
              backgroundColor: "var(--color-card)",
              backdropFilter: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-[--color-border] flex-shrink-0">
              <h2 className="text-lg font-semibold text-[--color-title]">
                {t("changeLanguage")}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-[--color-label] hover:text-[--color-title] border-none"
              >
                <X size={24} />
              </button>
            </header>

            {/* Language List */}
            <ul className="overflow-y-auto p-2 flex-grow">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleSelect(lang)}
                    className={`w-full p-3 rounded-lg text-left transition-colors font-semibold border-none ${
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}