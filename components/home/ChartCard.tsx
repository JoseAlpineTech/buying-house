"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionCard from "../ui/SectionCard";
import ExplanationBox from "../ui/ExplanationBox";

interface ChartCardProps {
  title: string;
  chartComponent: React.ReactNode;
  explanationTitle: string;
  explanationContent: React.ReactNode;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      const updateMatch = () => setMatches(media.matches);
      updateMatch();
      media.addEventListener("change", updateMatch);
      return () => media.removeEventListener("change", updateMatch);
    }
  }, [query]);
  return matches;
};

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061 3.5 3.5 0 014.95 4.95l-2.056 2.056a.75.75 0 01-1.06-1.06l2.056-2.056a2 2 0 00-2.828-2.828L8.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ChartCard({
  title,
  chartComponent,
  explanationTitle,
  explanationContent,
}: ChartCardProps) {
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const t = useTranslations("ChartCard");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsExplanationVisible(isDesktop);
  }, [isDesktop]);

  return (
    <SectionCard>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="chart-title">{title}</h3>
        <button
          onClick={() => setIsExplanationVisible(!isExplanationVisible)}
          className="p-1 rounded-full text-[--color-label] hover:bg-[--color-border] transition-colors"
          aria-label={t("toggleExplanation", { title })}
        >
          <InfoIcon />
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <motion.div
          layout
          animate={{ width: isExplanationVisible ? "60%" : "100%" }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          className="w-full"
        >
          {chartComponent}
        </motion.div>
        <AnimatePresence>
          {isExplanationVisible && (
            <ExplanationBox title={explanationTitle}>
              {explanationContent}
            </ExplanationBox>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}