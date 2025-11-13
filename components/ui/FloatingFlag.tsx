"use client";

import { motion, AnimatePresence } from "framer-motion";
import { countryCodeMap } from "../../data/countryCodes";

interface FloatingFlagProps {
  countryCode: string;
}

export default function FloatingFlag({ countryCode }: FloatingFlagProps) {
  const twoLetterCode = countryCodeMap[countryCode] ?? "";

  return (
    <div className="fixed top-6 right-6 z-50">
      <AnimatePresence mode="wait">
        <motion.span
          key={twoLetterCode}
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fi fi-${twoLetterCode} w-12 h-8 rounded-md shadow-2xl`}
          title={`Flag of ${countryCode}`}
        />
      </AnimatePresence>
    </div>
  );
}