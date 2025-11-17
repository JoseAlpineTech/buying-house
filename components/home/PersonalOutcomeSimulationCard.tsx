"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  runPersonalOutcomeSimulation,
  PersonalOutcomeResult,
  SimulationAssumptions,
} from "../../lib/simulator";
import { DEFAULT_SIMULATION_ASSUMPTIONS } from "../../lib/simulationConstants";

interface PersonalOutcomeSimulationCardProps {
  currentHomePrice: number;
  mortgageRate: number;
  currency: string;
  defaultIncome: number;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
};

export function PersonalOutcomeSimulationCard({
  currentHomePrice,
  mortgageRate,
  currency,
  defaultIncome,
}: PersonalOutcomeSimulationCardProps) {
  const [customIncome, setCustomIncome] = useState(defaultIncome);
  const [monthlySavings, setMonthlySavings] = useState(
    Math.round(defaultIncome / 12 / 10),
  ); // default: ~10% income
  const [yearsToSimulate, setYearsToSimulate] = useState(25);
  const [downPayment, setDownPayment] = useState(currentHomePrice * 0.2);
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(
    DEFAULT_SIMULATION_ASSUMPTIONS,
  );
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  const t = useTranslations("PersonalOutcomeSimulation");
  const tAsset = useTranslations("AssetPerformanceSimulation");

  useEffect(() => {
    setDownPayment(currentHomePrice * 0.2);
  }, [currentHomePrice]);

  useEffect(() => {
    setCustomIncome(defaultIncome);
    setMonthlySavings(Math.round(defaultIncome / 12 / 10));
  }, [defaultIncome]);

  const simulationResult: PersonalOutcomeResult = useMemo(() => {
    return runPersonalOutcomeSimulation({
      customIncome,
      monthlySavings,
      downPayment,
      yearsToSimulate,
      currentHomePrice,
      mortgageRate,
      mortgageTerm: 30,
      assumptions,
    });
  }, [
    customIncome,
    monthlySavings,
    downPayment,
    yearsToSimulate,
    currentHomePrice,
    mortgageRate,
    assumptions,
  ]);

  const { homeownerNetWorth, renterNetWorth } = simulationResult;
  const difference = Math.abs(homeownerNetWorth - renterNetWorth);
  const buyingIsBetter = homeownerNetWorth > renterNetWorth;

  const handleAssumptionChange = (
    key: keyof SimulationAssumptions,
    value: string,
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAssumptions((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const assumptionLabels: { [key in keyof SimulationAssumptions]?: string } = {
    annualHomePriceGrowth: tAsset("assumption_annualHomePriceGrowth"),
    annualStockMarketReturn: tAsset("assumption_annualStockMarketReturn"),
  };

  return (
    <div className="p-4 rounded-lg bg-[--color-card] border border-[--color-border]">
      <p
        className="text-sm text-[--color-text] mb-6"
        dangerouslySetInnerHTML={{ __html: t.raw("disclaimer") }}
      />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">

        {/* Income */}
        <div>
          <label className="block text-lg font-semibold text-[--color-label] mb-2">
            {t("annualIncomeLabel")}
            <strong className="text-[--color-accent]">
              {formatCurrency(customIncome, currency)}
            </strong>
          </label>
          <input
            type="range"
            min={defaultIncome * 0.25}
            max={defaultIncome * 4}
            step={1000}
            value={customIncome}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCustomIncome(val);
              setMonthlySavings(Math.round(val / 12 / 10));
            }}
            className="w-full"
          />
        </div>

        {/* Monthly Savings */}
        <div>
          <label className="block text-lg font-semibold text-[--color-label] mb-2">
            Your Monthly Savings:
            <strong className="text-[--color-accent]">
              {formatCurrency(monthlySavings, currency)}
            </strong>
          </label>
          <input
            type="range"
            min={0}
            max={Math.round((customIncome / 12) * 0.5)}
            step={50}
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-lg font-semibold text-[--color-label] mb-2">
            {t("downPaymentLabel")}
            <strong className="text-[--color-accent]">
              {formatCurrency(downPayment, currency)}
            </strong>
          </label>
          <input
            type="range"
            min={currentHomePrice * 0.05}
            max={currentHomePrice * 0.5}
            step={1000}
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Time Horizon */}
        <div>
          <label className="block text-lg font-semibold text-[--color-label] mb-2">
            {t("timeHorizonLabel")}
            <strong className="text-[--color-accent]">
              {yearsToSimulate} {t("years")}
            </strong>
          </label>
          <div className="flex gap-2 flex-wrap">
            {[20, 25, 30, 35].map((year) => (
              <button
                key={year}
                onClick={() => setYearsToSimulate(year)}
                className={`px-4 py-1 rounded-md border text-base font-semibold transition-all duration-200 ${
                  yearsToSimulate === year
                    ? "bg-[--color-accent] text-[--color-bg] border-[--color-accent] shadow-[0_0_8px_var(--color-accent)]"
                    : "bg-transparent text-[--color-label] border-[--color-border] hover:bg-[--color-border]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6 rounded-lg bg-[--color-card] border border-[--color-border]">

        <div className="p-4">
          <h3 className="text-2xl font-bold text-[--color-title] mb-3">
            {t("homeownerPathTitle")}
          </h3>
          <p className="text-xl pt-2">
            {t("homeownerNetWorth")}
            <strong className="text-[--color-accent] text-2xl">
              {formatCurrency(homeownerNetWorth, currency)}
            </strong>
          </p>
        </div>

        <div className="p-4">
          <h3 className="text-2xl font-bold text-[--color-title] mb-3">
            {t("renterPathTitle")}
          </h3>
          <p className="text-xl pt-2">
            {t("renterNetWorth")}
            <strong className="text-[--color-accent] text-2xl">
              {formatCurrency(renterNetWorth, currency)}
            </strong>
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-6 p-4 text-center rounded-lg bg-[--color-card] border border-[--color-border]">
        <h3 className="text-xl font-semibold text-[--color-title]">
          {t("verdictTitle", { yearsToSimulate })}
        </h3>
        <p className="text-lg text-[--color-text] mt-1">
          {t.rich("verdictContent", {
            choice: t(
              buyingIsBetter ? "verdictChoice_buy" : "verdictChoice_rent",
            ),
            difference: formatCurrency(difference, currency),
            strong_label: (chunks) => (
              <strong className="text-[--color-label]">{chunks}</strong>
            ),
            strong_accent: (chunks) => (
              <strong className="text-[--color-accent]">{chunks}</strong>
            ),
          })}
        </p>
      </div>

      {/* Advanced Settings */}
      <div className="mt-6">
        <button
          onClick={() => setIsAdvancedVisible(!isAdvancedVisible)}
          className="text-sm text-[--color-label] underline hover:text-[--color-accent] bg-transparent border-none p-0"
        >
          {isAdvancedVisible
            ? tAsset("advancedAssumptionsToggle_hide")
            : tAsset("advancedAssumptionsToggle_show")}
          {tAsset("advancedAssumptionsToggle_label")}
        </button>

        <AnimatePresence>
          {isAdvancedVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 rounded-lg bg-[--color-card] border border-[--color-border]">
                {(Object.keys(assumptions) as Array<
                  keyof SimulationAssumptions
                >)
                  .filter(
                    (key) =>
                      key === "annualHomePriceGrowth" ||
                      key === "annualStockMarketReturn",
                  )
                  .map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-[--color-label] capitalize">
                        {assumptionLabels[key]} (
                        <strong className="text-[--color-accent]">
                          {assumptions[key]}%
                        </strong>
                        )
                      </label>
                      <input
                        type="range"
                        min={key === "annualStockMarketReturn" ? 1 : 0}
                        max={12}
                        step={0.1}
                        value={assumptions[key]}
                        onChange={(e) =>
                          handleAssumptionChange(key, e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  ))}

                <div className="col-span-full flex justify-end pt-4">
                  <button
                    onClick={() =>
                      setAssumptions(DEFAULT_SIMULATION_ASSUMPTIONS)
                    }
                    className="px-4 py-2 rounded-md border border-[--color-border] text-[--color-label] hover:bg-[--color-border] transition"
                  >
                    {tAsset("resetButton")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
