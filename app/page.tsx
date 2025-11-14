"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { affordabilityData } from "../data/affordability";
import { currencies } from "../data/currency";
import { calcMortgagePayment, calcMPS, calcYDP } from "../lib/metrics";
import {
  generateAffordabilitySummary,
  getMetricsForYear,
} from "../lib/insights";
import { BASE_HOUSE_PRICES_2015 } from "../lib/constants";
import { MethodologyModal } from "../components/ui/MethodologyModal";
import { AssumptionsModal } from "../components/ui/AssumptionsModal";
import Hero from "../components/home/Hero";
import Snapshot from "../components/home/Snapshot";
import Footer from "../components/home/Footer";
import SectionCard from "../components/ui/SectionCard";
import CollapsibleSectionCard from "../components/ui/CollapsibleSectionCard";
import ComparisonTable, {
  ComparisonData,
  SortKey,
  SortDirection,
} from "../components/home/ComparisonTable";
import { AffordabilityTrendsChart } from "../components/charts/AffordabilityTrendsChart";
import { MortgageBurdenChart } from "../components/charts/MortgageBurdenChart";
import { PriceToRentChart } from "../components/charts/PriceToRentChart";
import { TotalHouseholdsChart } from "../components/charts/TotalHouseholdsChart";
import FloatingFlag from "../components/ui/FloatingFlag";

export const runtime = "edge";

// Scenarios removed, using "Average Homebuyer" profile as default
const ltv = 90;
const term = 30;
const savingsRate = 10;

const countryDisplayNames: { [key: string]: string } = {
  AUS: "Australia",
  AUT: "Austria",
  BEL: "Belgium",
  CAN: "Canada",
  CHL: "Chile",
  COL: "Colombia",
  CRI: "Costa Rica",
  CZE: "Czech Republic",
  DNK: "Denmark",
  EST: "Estonia",
  FIN: "Finland",
  FRA: "France",
  DEU: "Germany",
  GRC: "Greece",
  HUN: "Hungary",
  ISL: "Iceland",
  IRL: "Ireland",
  ISR: "Israel",
  ITA: "Italy",
  JPN: "Japan",
  KOR: "South Korea",
  LVA: "Latvia",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  MEX: "Mexico",
  NLD: "Netherlands",
  NZL: "New Zealand",
  NOR: "Norway",
  POL: "Poland",
  PRT: "Portugal",
  SVK: "Slovakia",
  SVN: "Slovenia",
  ESP: "Spain",
  SWE: "Sweden",
  CHE: "Switzerland",
  TUR: "Turkey",
  GBR: "United Kingdom",
  USA: "United States",
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

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("CAN");
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);
  const [isPtiExplanationVisible, setIsPtiExplanationVisible] = useState(true);
  const [isMbExplanationVisible, setIsMbExplanationVisible] = useState(true);
  const [isPtrExplanationVisible, setIsPtrExplanationVisible] = useState(true);
  const [isThhExplanationVisible, setIsThhExplanationVisible] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>({ key: "pti", direction: "ascending" });

  const countryData =
    affordabilityData[selectedCountry as keyof typeof affordabilityData];
  const countries = Object.keys(affordabilityData);
  const selectedCountryName =
    countryDisplayNames[selectedCountry] ?? selectedCountry;
  const currency =
    currencies[selectedCountry as keyof typeof currencies] ?? currencies.USA;

  // Memoize comparison data calculation
  const comparisonData: ComparisonData[] = useMemo(() => {
    return Object.keys(affordabilityData)
      .map((countryCode): ComparisonData | null => {
        const cData =
          affordabilityData[countryCode as keyof typeof affordabilityData];
        if (
          !cData ||
          !cData.realIncome?.length ||
          !cData.mortgageRate?.length
        )
          return null;

        const endYear = cData.realIncome.slice(-1)[0].year;
        const metrics = getMetricsForYear(cData, endYear, countryCode);
        const rate = cData.mortgageRate.slice(-1)[0]?.value ?? 0;

        if (!metrics) {
          return {
            countryCode,
            countryName: countryDisplayNames[countryCode] ?? countryCode,
            pti: null,
            mps: null,
            ydp: null,
          };
        }

        const payment = calcMortgagePayment(
          rate,
          metrics.housePrice,
          ltv,
          term,
        );
        const mps = calcMPS(metrics.income, payment);
        const ydp = calcYDP(
          metrics.housePrice,
          ltv,
          metrics.income,
          savingsRate,
        );

        return {
          countryCode,
          countryName: countryDisplayNames[countryCode] ?? countryCode,
          pti: metrics.pti,
          mps,
          ydp,
        };
      })
      .filter((item): item is ComparisonData => item !== null);
  }, []);

  const comparisonSubtitle = useMemo(() => {
    if (!sortConfig) return "";
    const labels: Record<SortKey, string> = {
      countryName: "Country Name",
      pti: "Price-to-Income",
      mps: "Mortgage Burden",
      ydp: "Years to Save",
    };
    const label = labels[sortConfig.key];
    const direction =
      sortConfig.direction === "ascending" ? "Ascending" : "Descending";
    return `Sorted by ${label} (${direction})`;
  }, [sortConfig]);

  // Guard clause for missing data for the selected country
  if (
    !countryData ||
    !countryData.realIncome?.length ||
    !countryData.realHousePriceIndex?.length ||
    !countryData.mortgageRate?.length ||
    !countryData.rentPriceIndex?.length ||
    !countryData.numberOfHouseholds?.length ||
    !BASE_HOUSE_PRICES_2015[selectedCountry]
  ) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-10">
        <FloatingFlag
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
          countryDisplayNames={countryDisplayNames}
        />
        <Hero />
        <div className="mt-12 text-center text-xl text-[--color-label]">
          <p>
            Sorry, complete inflation-adjusted affordability data is not
            available for {selectedCountryName}. Please select another country.
          </p>
        </div>
        <Footer
          onMethodologyOpen={() => setIsMethodologyModalOpen(true)}
          onAssumptionsOpen={() => setIsAssumptionsModalOpen(true)}
        />
        <MethodologyModal
          isOpen={isMethodologyModalOpen}
          onClose={() => setIsMethodologyModalOpen(false)}
        />
        <AssumptionsModal
          isOpen={isAssumptionsModalOpen}
          onClose={() => setIsAssumptionsModalOpen(false)}
          countryName={selectedCountryName}
          baseHousePrice={BASE_HOUSE_PRICES_2015[selectedCountry]}
          latestMortgageRate={0}
          dataStartYear={0}
          dataEndYear={0}
          currency={currency.code}
        />
      </main>
    );
  }

  const startYear = countryData.realIncome[0].year;
  const endYear = countryData.realIncome.slice(-1)[0].year;

  const startMetrics = getMetricsForYear(
    countryData,
    startYear,
    selectedCountry,
  );
  const endMetrics = getMetricsForYear(countryData, endYear, selectedCountry);

  const insightSummary =
    startMetrics && endMetrics
      ? generateAffordabilitySummary(startMetrics, endMetrics)
      : [];

  const latestMortgageRate =
    countryData.mortgageRate?.slice(-1)[0]?.value ?? 0;

  const housePrice = endMetrics?.housePrice ?? 0;
  const income = endMetrics?.income ?? 0;
  const pti = endMetrics?.pti ?? 0;

  const monthlyPayment = calcMortgagePayment(
    latestMortgageRate,
    housePrice,
    ltv,
    term,
  );
  const mps = calcMPS(income, monthlyPayment);
  const ydp = calcYDP(housePrice, ltv, income, savingsRate);

  // Data for Assumptions Modal
  const baseHousePrice = BASE_HOUSE_PRICES_2015[selectedCountry];
  const startIncome = countryData.realIncome[0]?.value;
  const endIncome = countryData.realIncome.slice(-1)[0]?.value;
  const startIndexValue = countryData.realHousePriceIndex[0]?.value;
  const endIndexValue = countryData.realHousePriceIndex.slice(-1)[0]?.value;

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-10">
      <FloatingFlag
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
        countryDisplayNames={countryDisplayNames}
      />
      <Hero startYear={startYear} />

      <SectionCard>
        <Snapshot
          startYear={startYear}
          endYear={endYear}
          selectedCountryName={selectedCountryName}
          housePrice={housePrice}
          pti={pti}
          mps={mps}
          ydp={ydp}
          monthlyPayment={monthlyPayment}
          insightSummary={insightSummary}
          currency={currency.code}
        />
      </SectionCard>

      {/* Price-to-Income Ratio Chart Card */}
      <SectionCard>
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
              countryCode={selectedCountry}
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
      </SectionCard>

      {/* Mortgage Burden Chart Card */}
      <SectionCard>
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
              countryCode={selectedCountry}
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
      </SectionCard>

      {/* Price-to-Rent Ratio Chart Card */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="chart-title">Price-to-Rent Index</h3>
          <button
            onClick={() => setIsPtrExplanationVisible(!isPtrExplanationVisible)}
            className="p-1 rounded-full text-[--color-label] hover:bg-[--color-border] transition-colors"
            aria-label="Toggle Price-to-Rent explanation"
          >
            <InfoIcon />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.div
            layout
            animate={{ width: isPtrExplanationVisible ? "60%" : "100%" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            className="w-full"
          >
            <PriceToRentChart countryData={countryData} />
          </motion.div>
          <AnimatePresence>
            {isPtrExplanationVisible && (
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
                    This index measures the cost of buying a home relative to
                    renting one. It's calculated by dividing the house price
                    index by the rent price index.
                  </span>
                  <span>
                    A <strong>higher</strong> index suggests that house prices
                    are high relative to rental costs. This can indicate that it
                    might be more financially advantageous to rent than to buy.
                  </span>
                  <span>
                    The index is set to <strong>100 in 2015</strong>. Values
                    above 100 mean buying has become more expensive than renting
                    compared to 2015.
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionCard>

      {/* Total Households Chart Card */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="chart-title">Total Households</h3>
          <button
            onClick={() => setIsThhExplanationVisible(!isThhExplanationVisible)}
            className="p-1 rounded-full text-[--color-label] hover:bg-[--color-border] transition-colors"
            aria-label="Toggle Total Households explanation"
          >
            <InfoIcon />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.div
            layout
            animate={{ width: isThhExplanationVisible ? "60%" : "100%" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            className="w-full"
          >
            <TotalHouseholdsChart countryData={countryData} />
          </motion.div>
          <AnimatePresence>
            {isThhExplanationVisible && (
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
                    This chart shows the total number of households in the
                    country over time.
                  </span>
                  <span>
                    An <strong>increase</strong> in the number of households can
                    be a significant driver of housing demand, often leading to
                    upward pressure on prices and rents if supply does not keep
                    pace.
                  </span>
                  <span>
                    Factors like population growth, immigration, and changes in
                    living arrangements (e.g., smaller household sizes) all
                    contribute to this trend.
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionCard>

      {/* Comparison Table Card */}
      <CollapsibleSectionCard
        title="Country Comparison"
        subtitle={comparisonSubtitle}
      >
        <ComparisonTable
          data={comparisonData}
          selectedCountryCode={selectedCountry}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
        />
      </CollapsibleSectionCard>

      <Footer
        onMethodologyOpen={() => setIsMethodologyModalOpen(true)}
        onAssumptionsOpen={() => setIsAssumptionsModalOpen(true)}
      />

      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />
      <AssumptionsModal
        isOpen={isAssumptionsModalOpen}
        onClose={() => setIsAssumptionsModalOpen(false)}
        countryName={selectedCountryName}
        baseHousePrice={baseHousePrice}
        latestMortgageRate={latestMortgageRate}
        dataStartYear={startYear}
        dataEndYear={endYear}
        startIncome={startIncome}
        endIncome={endIncome}
        startIndexValue={startIndexValue}
        endIndexValue={endIndexValue}
        currency={currency.code}
      />
    </main>
  );
}