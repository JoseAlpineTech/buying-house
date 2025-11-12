"use client";

import { useState } from "react";
import { affordabilityData } from "../data/affordability";
import { calcMortgagePayment, calcMPS, calcYDP } from "../lib/metrics";
import {
  generateAffordabilitySummary,
  getMetricsForYear,
} from "../lib/insights";
import { BASE_HOUSE_PRICES_2015 } from "../lib/constants";
import { MethodologyModal } from "../components/ui/MethodologyModal";
import Hero from "../components/home/Hero";
import ControlPanel from "../components/home/ControlPanel";
import Snapshot from "../components/home/Snapshot";
import Charts from "../components/home/Charts";
import Footer from "../components/home/Footer";

export const runtime = "edge";

const scenarios = [
  { name: "High Saver", ltv: 80, term: 30, savingsRate: 15 },
  { name: "Average Homebuyer", ltv: 90, term: 30, savingsRate: 10 },
  { name: "Stretched Buyer", ltv: 95, term: 30, savingsRate: 5 },
] as const;

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

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("CAN");
  const [scenarioIndex, setScenarioIndex] = useState(1);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  const { ltv, term, savingsRate } = scenarios[scenarioIndex];
  const countryData =
    affordabilityData[selectedCountry as keyof typeof affordabilityData];
  const countries = Object.keys(affordabilityData);
  const selectedCountryName =
    countryDisplayNames[selectedCountry] ?? selectedCountry;

  // Guard clause for missing data
  if (
    !countryData ||
    !countryData.realIncome?.length ||
    !countryData.realHousePriceIndex?.length ||
    !BASE_HOUSE_PRICES_2015[selectedCountry]
  ) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-10">
        <Hero />
        <ControlPanel
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
          countryDisplayNames={countryDisplayNames}
          scenarios={scenarios}
          scenarioIndex={scenarioIndex}
          setScenarioIndex={setScenarioIndex}
        />
        <div className="mt-12 text-center text-xl text-[--color-label]">
          <p>
            Sorry, complete inflation-adjusted affordability data is not
            available for {selectedCountryName}.
          </p>
        </div>
        <Footer onMethodologyOpen={() => setIsMethodologyModalOpen(true)} />
        <MethodologyModal
          isOpen={isMethodologyModalOpen}
          onClose={() => setIsMethodologyModalOpen(false)}
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

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-10">
      <Hero />
      <ControlPanel
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
        countryDisplayNames={countryDisplayNames}
        scenarios={scenarios}
        scenarioIndex={scenarioIndex}
        setScenarioIndex={setScenarioIndex}
      />
      <Snapshot
        endYear={endYear}
        selectedCountryName={selectedCountryName}
        housePrice={housePrice}
        pti={pti}
        mps={mps}
        ydp={ydp}
        monthlyPayment={monthlyPayment}
        insightSummary={insightSummary}
      />
      <Charts
        countryData={countryData}
        countryCode={selectedCountry}
        ltv={ltv}
        term={term}
        savingsRate={savingsRate}
      />
      <Footer onMethodologyOpen={() => setIsMethodologyModalOpen(true)} />

      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />
    </main>
  );
}