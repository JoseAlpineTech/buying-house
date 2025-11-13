"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AffordabilityTrendsChart } from "../charts/AffordabilityTrendsChart";
import { MortgageBurdenChart } from "../charts/MortgageBurdenChart";
import type { CountryData } from "../../data/affordability";

interface ChartsProps {
  countryData: CountryData;
  countryCode: string;
  ltv: number;
  term: number;
  latestMortgageRate: number;
}

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

export default function Charts({
  countryData,
  countryCode,
  ltv,
  term,
  latestMortgageRate,
}: ChartsProps) {
  const [isPtiExplanationVisible, setIsPtiExplanationVisible] = useState(true);
  const [isMbExplanationVisible, setIsMbExplanationVisible] = useState(true);

  return (
    <div className="space-y-10">
      {/* Price-to-Income Ratio Chart */}
      <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="chart-title">Price-to-Income Ratio</h3>
          <button
            onClick={() => setIsPtiExplanationVisible(!isPtiExplanationVisible)}
            className="p-1 rounded-full text-[--color-label] hover:bg-[--color-border] transition-colors"
            aria-label="Toggle Price-to-Income explanation"
          >
            <InfoIcon />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.div
            layout
            animate={{ width: isPtiExplanationVisible ? "60%" : "100%" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            className="w-full"
          >
            <AffordabilityTrendsChart
              countryData={countryData}
              countryCode={countryCode}
            />
          </motion.div>
          <AnimatePresence>
            {isPtiExplanationVisible && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-[40%] p-4 rounded-lg bg-[#061522] border border-[--color-border]"
              >
                <h4 className="text-lg font-semibold text-[--color-label] mb-2">
                  What is this?
                </h4>
                <p className="text-sm text-[--color-text] space-y-2">
                  <span>
                    This ratio shows how many years of{" "}
                    <strong>gross household income</strong> it would take to buy
                    an average home.
                  </span>
                  <span>
                    A <strong>higher</strong> ratio means housing is{" "}
                    <strong>less affordable</strong>. All data is
                    inflation-adjusted to 2015 dollars for a fair comparison
                    over time.
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mortgage Burden Chart */}
      <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="chart-title">Mortgage Burden</h3>
          <button
            onClick={() => setIsMbExplanationVisible(!isMbExplanationVisible)}
            className="p-1 rounded-full text-[--color-label] hover:bg-[--color-border] transition-colors"
            aria-label="Toggle Mortgage Burden explanation"
          >
            <InfoIcon />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.div
            layout
            animate={{ width: isMbExplanationVisible ? "60%" : "100%" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            className="w-full"
          >
            <MortgageBurdenChart
              countryData={countryData}
              countryCode={countryCode}
              ltv={ltv}
              term={term}
              rate={latestMortgageRate}
            />
          </motion.div>
          <AnimatePresence>
            {isMbExplanationVisible && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-[40%] p-4 rounded-lg bg-[#061522] border border-[--color-border]"
              >
                <h4 className="text-lg font-semibold text-[--color-label] mb-2">
                  What is this?
                </h4>
                <p className="text-sm text-[--color-text] space-y-2">
                  <span>
                    This shows the percentage of{" "}
                    <strong>gross household income</strong> needed to cover the
                    monthly payment on an average home.
                  </span>
                  <span>
                    A <strong>higher</strong> percentage means a greater
                    financial burden. This chart calculates the burden for every
                    year using the same recent interest rate for a fair
                    comparison.
                  </span>
                  <span>
                    The <strong>30% line</strong> represents a common
                    affordability benchmark. Spending more than this is often
                    considered "housing cost-burdened."
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}