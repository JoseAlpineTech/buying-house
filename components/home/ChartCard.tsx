"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionCard from "../ui/SectionCard";
import ExplanationBox from "../ui/ExplanationBox";

interface ChartCardProps {
  title: string;
  // Supports either a static node or a render function that receives state
  chartComponent:
    | React.ReactNode
    | ((props: { isComparing: boolean }) => React.ReactNode);
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

const CompareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M15 3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h10zm-9 7a1 1 0 000 2h8a1 1 0 100-2H6zm0-4a1 1 0 100 2h8a1 1 0 100-2H6z" />
  </svg>
);

export default function ChartCard({
  title,
  chartComponent,
  explanationTitle,
  explanationContent,
}: ChartCardProps) {
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const t = useTranslations("ChartCard");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsExplanationVisible(isDesktop);
  }, [isDesktop]);

  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="chart-title">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`p-1 rounded-full transition-colors ${
              isComparing
                ? "bg-[--color-accent] text-[--color-card]"
                : "text-[--color-label] hover:bg-[--color-border]"
            }`}
            aria-label={
              isComparing
                ? t("toggleComparisonOff")
                : t("toggleComparison")
            }
            title={
              isComparing
                ? t("toggleComparisonOff")
                : t("toggleComparison")
            }
          >
            <CompareIcon />
          </button>
          <button
            onClick={() => setIsExplanationVisible(!isExplanationVisible)}
            className="p-1 rounded-full text-[--color-label] hover:bg-[--color-border] transition-colors"
            aria-label={t("toggleExplanation", { title })}
          >
            <InfoIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <motion.div
          layout
          animate={{
            width: isDesktop && isExplanationVisible ? "60%" : "100%",
          }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          className="w-full"
        >
          {typeof chartComponent === "function"
            ? chartComponent({ isComparing })
            : chartComponent}
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