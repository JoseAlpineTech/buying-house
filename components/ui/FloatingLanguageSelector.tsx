"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { languages } from "../../data/languages";

type Language = (typeof languages)[number];

export default function FloatingLanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0],
  );

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

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
    // Placeholder for future functionality
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed top-20 right-6 z-50 flex flex-col items-end"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-2xl hover:bg-[--color-border] transition-colors"
        title="Change Language"
      >
        <span className="text-sm text-[--color-label]">Language:</span>
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
            className="mt-2 w-48 max-h-80 overflow-y-auto rounded-lg border border-[--color-border] shadow-2xl bg-[--color-card]/95 backdrop-blur-lg"
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