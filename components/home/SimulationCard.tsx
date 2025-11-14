"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  runSimulation,
  SimulationAssumptions,
  SimulationResult,
} from "../../lib/simulator";
import { DEFAULT_SIMULATION_ASSUMPTIONS } from "../../lib/simulationConstants";
import SensitivityCurve from "../charts/SensitivityCurve";

interface SimulationCardProps {
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

export default function SimulationCard({
  currentHomePrice,
  mortgageRate,
  currency,
}: SimulationCardProps) {
  const [downPayment, setDownPayment] = useState(currentHomePrice * 0.2);
  const [yearsToSimulate, setYearsToSimulate] = useState(25); // typical horizon
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(
    DEFAULT_SIMULATION_ASSUMPTIONS,
  );
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

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

  return (
    <section className="relative rounded-xl border border-[--color-border] bg-[--color-card] p-8 mt-12">
      <h2 className="text-4xl font-bold text-[--color-title] mb-2">
        Your Financial Future: Homeowner vs. Renter
      </h2>

      {/* Updated description with disclaimer */}
      <p className="text-sm text-[--color-text] mb-6">
        This simulation projects potential long-term outcomes for buying a home versus renting and investing your savings. The numbers are based on historical averages and simplifying assumptions <strong>not</strong>{" "} predictions. Markets, housing prices, and personal circumstances can change in ways no model can fully anticipate. <strong>Nobody can predict the future.</strong>
      </p>

      {/* --- User Controls --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Down payment */}
        <div>
          <label className="block text-lg font-semibold text-[--color-label] mb-2">
            Your Down Payment:{" "}
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
            Time Horizon:{" "}
            <strong className="text-[--color-accent]">
              {yearsToSimulate} Years
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-[#061522] border border-[--color-border]">
        {/* Homeowner */}
        <div className="p-4">
          <h3 className="text-2xl font-bold text-[--color-title] mb-3">
            🏠 Homeowner Path
          </h3>
          <div className="space-y-2 text-base">
            <p>
              Final Home Value:{" "}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.homeowner.finalHomeValue,
                  currency,
                )}
              </strong>
            </p>
            <p>
              Remaining Mortgage:{" "}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.homeowner.remainingMortgage,
                  currency,
                )}
              </strong>
            </p>
            <p className="text-xl pt-2">
              Your Home Equity:{" "}
              <strong className="text-[--color-accent] text-2xl">
                {formatCurrency(homeownerWealth, currency)}
              </strong>
            </p>
          </div>
        </div>

        {/* Renter */}
        <div className="p-4">
          <h3 className="text-2xl font-bold text-[--color-title] mb-3">
            📈 Renter & Investor Path
          </h3>
          <div className="space-y-2 text-base">
            <p>
              Initial Investment:{" "}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.renter.initialInvestment,
                  currency,
                )}
              </strong>
            </p>
            <p>
              Added Monthly Savings:{" "}
              <strong className="text-[--color-label]">
                {formatCurrency(
                  simulationResult.renter.extraMonthlyInvestment,
                  currency,
                )}
              </strong>
            </p>
            <p className="text-xl pt-2">
              Final Investment Value:{" "}
              <strong className="text-[--color-accent] text-2xl">
                {formatCurrency(renterWealth, currency)}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* --- Verdict --- */}
      <div className="mt-6 p-4 text-center rounded-lg bg-[#061522] border border-[--color-border]">
        <h3 className="text-xl font-semibold text-[--color-title]">
          After {yearsToSimulate} years...
        </h3>
        <p className="text-lg text-[--color-text] mt-1">
          In this scenario,{" "}
          <strong className="text-[--color-label]">
            {buyingIsBetter ? "buying a home" : "renting and investing"}
          </strong>{" "}
          could leave you wealthier by{" "}
          <strong className="text-[--color-accent]">
            {formatCurrency(difference, currency)}
          </strong>
          .
        </p>
      </div>

      {/* --- Sensitivity Chart (stacked below verdict) --- */}
      <div className="mt-6 p-4 rounded-lg bg-[#061522] border border-[--color-border]">
        <h3 className="text-lg font-semibold text-[--color-title] mb-2">
          Sensitivity: Stock Market Return
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
          {isAdvancedVisible ? "Hide" : "Show"} Advanced Assumptions
        </button>

        <AnimatePresence>
          {isAdvancedVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-lg bg-[#061522] border border-[--color-border]">
                {Object.entries(assumptions).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-[--color-label] capitalize">
                      {key.replace(/([A-Z])/g, " $1")} (
                      <strong className="text-[--color-accent]">{value}%</strong>
                      )
                    </label>
                    <input
                      type="range"
                      min={key === "annualStockMarketReturn" ? 1 : 0}
                      max={12}
                      step={0.1}
                      value={value}
                      onChange={(e) =>
                        handleAssumptionChange(
                          key as keyof SimulationAssumptions,
                          e.target.value,
                        )
                      }
                      className="w-full"
                    />
                  </div>
                ))}

                {/* Reset button */}
                <div className="col-span-full flex justify-end pt-4">
                  <button
                    onClick={() =>
                      setAssumptions({ ...DEFAULT_SIMULATION_ASSUMPTIONS })
                    }
                    className="px-4 py-2 rounded-md border border-[--color-border] text-[--color-label] hover:bg-[--color-border] transition"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
