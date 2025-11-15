"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  runSimulation,
  SimulationAssumptions,
  SimulationResult,
} from "../../lib/simulator";
import { DEFAULT_SIMULATION_ASSUMPTIONS } from "../../lib/simulationConstants";
import SensitivityCurve from "../charts/SensitivityCurve";

interface AssetPerformanceSimulationCardProps {
  currentHomePrice: number;
  mortgageRate: number;
  currency: string;
}

const formatCurrency = (
  value: number,
  currency: string,
  compact: boolean = false,
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(value);
};

export default function AssetPerformanceSimulationCard({
  currentHomePrice,
  mortgageRate,
  currency,
}: AssetPerformanceSimulationCardProps) {
  const [downPayment, setDownPayment] = useState(currentHomePrice * 0.2);
  const [yearsToSimulate, setYearsToSimulate] = useState(25);
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(
    DEFAULT_SIMULATION_ASSUMPTIONS,
  );
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  const t = useTranslations("AssetPerformanceSimulation");

  const simulationResult: SimulationResult = useMemo(() => {
    return runSimulation({
      downPayment,
      yearsToSimulate,
      currentHomePrice,
      mortgageRate,
      mortgageTerm: 30,
      assumptions,
    });
  }, [
    downPayment,
    yearsToSimulate,
    currentHomePrice,
    mortgageRate,
    assumptions,
  ]);

  const homeownerWealth = simulationResult.homeowner.homeEquity;
  const renterWealth = simulationResult.renter.finalInvestmentValue;
  const difference = Math.abs(homeownerWealth - renterWealth);
  const buyingIsBetter = homeownerWealth > renterWealth;

  const handleAssumptionChange = (
    key: keyof SimulationAssumptions,
    value: string,
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAssumptions((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const assumptionLabels: { [key in keyof SimulationAssumptions]: string } = {
    annualHomePriceGrowth: t("assumption_annualHomePriceGrowth"),
    annualStockMarketReturn: t("assumption_annualStockMarketReturn"),
    annualRentIncrease: t("assumption_annualRentIncrease"),
    annualOwnershipCostRate: t("assumption_annualOwnershipCostRate"),
    initialRentalYield: t("assumption_initialRentalYield"),
  };

  return (
    <div className="pt-8">
      <p
        className="text-sm text-[--color-text] mb-6"
        dangerouslySetInnerHTML={{ __html: t.raw("disclaimer") }}
      />

      {/* --- User Controls --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Down payment */}
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

        {/* Time horizon */}
        <div>
          <label className="block text-lg font-semibold text-[--color-label] mb-2">
            {t("timeHorizonLabel")}
            <strong className="text-[--color-accent]">
              {yearsToSimulate}
              {t("years")}
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

      {/* --- Results --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-[--color-card] border border-[--color-border]">
        {/* Homeowner */}
        <div className="p-4">
          <h3 className="text-2xl font-bold text-[--color-title] mb-3">
            {t("homeownerPathTitle")}
          </h3>
          <div className="space-y-2 text-base">
            <p>
              {t("finalHomeValue")}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.homeowner.finalHomeValue,
                  currency,
                )}
              </strong>
            </p>
            <p>
              {t("remainingMortgage")}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.homeowner.remainingMortgage,
                  currency,
                )}
              </strong>
            </p>
            <p className="text-xl pt-2">
              {t("homeEquity")}
              <strong className="text-[--color-accent] text-2xl">
                {formatCurrency(homeownerWealth, currency)}
              </strong>
            </p>
          </div>
        </div>

        {/* Renter */}
        <div className="p-4">
          <h3 className="text-2xl font-bold text-[--color-title] mb-3">
            {t("renterPathTitle")}
          </h3>
          <div className="space-y-2 text-base">
            <p>
              {t("initialInvestment")}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.renter.initialInvestment,
                  currency,
                )}
              </strong>
            </p>
            <p>
              {t("addedMonthlySavings")}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.renter.extraMonthlyInvestment,
                  currency,
                )}
              </strong>
            </p>
            <p className="text-xl pt-2">
              {t("finalInvestmentValue")}
              <strong className="text-[--color-accent] text-2xl">
                {formatCurrency(renterWealth, currency)}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* --- Verdict --- */}
      <div className="mt-6 p-4 text-center rounded-lg bg-[--color-card] border border-[--color-border]">
        <h3 className="text-xl font-semibold text-[--color-title]">
          {t("verdictTitle", { yearsToSimulate })}
        </h3>
        <p className="text-lg text-[--color-text] mt-1">
          {t.rich("verdictContent", {
            choice: t(buyingIsBetter ? "verdictChoice_buy" : "verdictChoice_rent"),
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

      {/* --- Sensitivity Chart (stacked below verdict) --- */}
      <div className="mt-6 p-4 rounded-lg bg-[--color-card] border border-[--color-border]">
        <h3 className="text-lg font-semibold text-[--color-title] mb-2">
          {t("sensitivityTitle")}
        </h3>
        <SensitivityCurve
          currentHomePrice={currentHomePrice}
          mortgageRate={mortgageRate}
          yearsToSimulate={yearsToSimulate}
          downPayment={downPayment}
          assumptions={assumptions}
          currency={currency}
        />
      </div>

      {/* --- Advanced Settings --- */}
      <div className="mt-6">
        <button
          onClick={() => setIsAdvancedVisible(!isAdvancedVisible)}
          className="text-sm text-[--color-label] underline hover:text-[--color-accent] bg-transparent border-none p-0"
        >
          {isAdvancedVisible
            ? t("advancedAssumptionsToggle_hide")
            : t("advancedAssumptionsToggle_show")}
          {t("advancedAssumptionsToggle_label")}
        </button>

        <AnimatePresence>
          {isAdvancedVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-lg bg-[--color-card] border border-[--color-border]">
                {(
                  Object.keys(assumptions) as Array<
                    keyof SimulationAssumptions
                  >
                ).map((key) => (
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

                {/* Reset button */}
                <div className="col-span-full flex justify-end pt-4">
                  <button
                    onClick={() =>
                      setAssumptions({
                        ...DEFAULT_SIMULATION_ASSUMPTIONS,
                      })
                    }
                    className="px-4 py-2 rounded-md border border-[--color-border] text-[--color-label] hover:bg-[--color-border] transition"
                  >
                    {t("resetButton")}
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