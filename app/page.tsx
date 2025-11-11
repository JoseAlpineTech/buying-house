"use client";

import { useState } from "react";
import { affordabilityData } from "../data/affordability";
import { calcMortgagePayment, calcMPS, calcYDP } from "../lib/metrics";
import {
  generateAffordabilitySummary,
  getMetricsForYear,
} from "../lib/insights";
import { AffordabilityTrendsChart } from "../components/charts/AffordabilityTrendsChart";
import { MortgageBurdenChart } from "../components/charts/MortgageBurdenChart";
import { RentPriceDivergenceChart } from "../components/charts/RentPriceDivergenceChart";
import { InfoModal } from "../components/ui/InfoModal";
import { PtiMiniChart } from "../components/charts/PtiMiniChart";
import { YdpMiniChart } from "../components/charts/YdpMiniChart";

export const runtime = "edge";

// Define the scenarios for the new slider
const scenarios = [
  {
    name: "High Saver / Low Risk",
    ltv: 80, // 20% Down Payment
    term: 30,
    savingsRate: 15,
  },
  {
    name: "Average Homebuyer",
    ltv: 90, // 10% Down Payment
    term: 30,
    savingsRate: 10,
  },
  {
    name: "Stretched Buyer / High Risk",
    ltv: 95, // 5% Down Payment
    term: 30,
    savingsRate: 5,
  },
] as const;

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("CAN");
  const [scenarioIndex, setScenarioIndex] = useState(1); // Default to "Average Homebuyer"
  const [isPtiModalOpen, setIsPtiModalOpen] = useState(false);
  const [isMpsModalOpen, setIsMpsModalOpen] = useState(false);
  const [isYdpModalOpen, setIsYdpModalOpen] = useState(false);

  // Derive parameters from the selected scenario
  const { ltv, term, savingsRate } = scenarios[scenarioIndex];

  const countryData =
    affordabilityData[selectedCountry as keyof typeof affordabilityData];
  const countries = Object.keys(affordabilityData);

  const latestIncomeData = countryData.income.slice(-1)[0];
  const latestMortgageRate = countryData.mortgageRate.slice(-1)[0].value;
  const latestPtiData = countryData.pti.slice(-1)[0];
  const housePrice = latestIncomeData.value * latestPtiData.value;

  const monthlyPayment = calcMortgagePayment(
    latestMortgageRate,
    housePrice,
    ltv,
    term,
  );
  const mps = calcMPS(latestIncomeData.value, monthlyPayment);
  const ydp = calcYDP(housePrice, ltv, latestIncomeData.value, savingsRate);

  const startYear = countryData.income[0].year;
  const endYear = latestIncomeData.year;

  const startMetrics = getMetricsForYear(countryData, startYear, ltv, savingsRate);
  const endMetrics = getMetricsForYear(countryData, endYear, ltv, savingsRate);

  const insightSummary =
    startMetrics && endMetrics
      ? generateAffordabilitySummary(startMetrics, endMetrics)
      : "Could not generate summary.";

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Housing Affordability
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Buying a house now vs. 40 years ago.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Controls Column */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold">Controls</h2>
            <div className="space-y-6">
              {/* Country Selector */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Country
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="mt-1 block w-full rounded-md border-zinc-300 bg-zinc-50 py-2 pl-3 pr-10 text-base text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scenario Slider */}
              <div className="pt-2">
                <label
                  htmlFor="scenario"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Buyer Scenario
                </label>
                <input
                  id="scenario"
                  type="range"
                  min="0"
                  max={scenarios.length - 1}
                  value={scenarioIndex}
                  onChange={(e) => setScenarioIndex(Number(e.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700"
                />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {scenarios[scenarioIndex].name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {`LTV: ${ltv}% | Savings: ${savingsRate}% | Term: ${term}yrs`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Metrics Display Column */}
        <section className="lg:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold">
              Calculated Metrics (for {endYear})
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    House Price
                  </h3>
                  <button
                    onClick={() => setIsPtiModalOpen(true)}
                    className="h-5 w-5 rounded-full border border-zinc-400 text-xs text-zinc-500 hover:bg-zinc-200 dark:border-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="More info about House Price calculation"
                  >
                    ?
                  </button>
                </div>
                <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                  ${housePrice.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Monthly Payment
                </h3>
                <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                  ${monthlyPayment.toFixed(2)}
                </p>
              </div>
              <div className="rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Mortgage to Income
                  </h3>
                  <button
                    onClick={() => setIsMpsModalOpen(true)}
                    className="h-5 w-5 rounded-full border border-zinc-400 text-xs text-zinc-500 hover:bg-zinc-200 dark:border-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="More info about Mortgage to Income ratio"
                  >
                    ?
                  </button>
                </div>
                <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {mps.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Years to Down Payment
                  </h3>
                  <button
                    onClick={() => setIsYdpModalOpen(true)}
                    className="h-5 w-5 rounded-full border border-zinc-400 text-xs text-zinc-500 hover:bg-zinc-200 dark:border-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    aria-label="More info about Years to Down Payment"
                  >
                    ?
                  </button>
                </div>
                <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {ydp.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <h3 className="text-md font-semibold text-blue-800 dark:text-blue-200">
                Insight Summary
              </h3>
              <p className="mt-2 text-blue-700 dark:text-blue-300">
                {insightSummary}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Chart Section */}
      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold">
            Affordability Trends (PTI vs PTR)
          </h2>
          <AffordabilityTrendsChart
            ptiData={countryData.pti}
            ptrData={countryData.ptr}
          />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold">
            Mortgage Burden (Payment as % of Income)
          </h2>
          <MortgageBurdenChart
            countryData={countryData}
            ltv={ltv}
            term={term}
          />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">
            Price vs. Rent Index (1985=100)
          </h2>
          <RentPriceDivergenceChart countryData={countryData} />
        </div>
      </section>

      {/* Footer for Attribution */}
      <footer className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          Source:{" "}
          <a
            href="https://data.oecd.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Organisation for Economic Co-operation and Development (OECD)
          </a>
          .
        </p>
      </footer>

      {/* Modals */}
      <InfoModal
        isOpen={isPtiModalOpen}
        onClose={() => setIsPtiModalOpen(false)}
        title="Understanding the House Price Metric"
      >
        <p>
          The house price shown is not an arbitrary number; it's a calculated
          metric designed to reflect the state of the housing market for the
          average person.
        </p>
        <p className="mt-4 text-xs italic">
          Data sourced from the OECD.
        </p>
        <PtiMiniChart data={countryData.pti} />
      </InfoModal>

      <InfoModal
        isOpen={isMpsModalOpen}
        onClose={() => setIsMpsModalOpen(false)}
        title="Understanding Mortgage to Income"
      >
        <p>
          This metric shows what percentage of a person's gross (pre-tax)
          monthly income is required to cover the monthly mortgage payment.
        </p>
        <p className="mt-4 text-xs italic">
          Data sourced from the OECD.
        </p>
        <div className="mt-4">
          <MortgageBurdenChart
            countryData={countryData}
            ltv={ltv}
            term={term}
            isMini={true}
          />
        </div>
      </InfoModal>

      <InfoModal
        isOpen={isYdpModalOpen}
        onClose={() => setIsYdpModalOpen(false)}
        title="Understanding Years to Down Payment"
      >
        <p>
          This metric calculates how many years it would take to save for a
          down payment, given the selected "Buyer Scenario".
        </p>
        <p className="mt-4 text-xs italic">
          Data sourced from the OECD.
        </p>
        <div className="mt-4">
          <YdpMiniChart
            countryData={countryData}
            ltv={ltv}
            savingsRate={savingsRate}
          />
        </div>
      </InfoModal>
    </main>
  );
}