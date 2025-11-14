"use client";

import { useState, useMemo } from "react";
import { affordabilityData } from "../../data/affordability";
import { currencies } from "../../data/currency";
import { countryDisplayNames } from "../../data/countryDisplayNames";
import { calcMortgagePayment, calcMPS, calcYDP } from "../../lib/metrics";
import {
  generateAffordabilitySummary,
  getMetricsForYear,
} from "../../lib/insights";
import { BASE_HOUSE_PRICES_2015 } from "../../lib/constants";
import { MethodologyModal } from "../../components/ui/MethodologyModal";
import { AssumptionsModal } from "../../components/ui/AssumptionsModal";
import Hero from "../../components/home/Hero";
import Snapshot from "../../components/home/Snapshot";
import Footer from "../../components/home/Footer";
import SectionCard from "../../components/ui/SectionCard";
import AssetPerformanceSimulationCard from "../../components/home/AssetPerformanceSimulationCard";
import { PersonalOutcomeSimulationCard } from "../../components/home/PersonalOutcomeSimulationCard";
import CollapsibleSectionCard from "../../components/ui/CollapsibleSectionCard";
import ChartCard from "../../components/home/ChartCard";
import ComparisonTable, {
  ComparisonData,
  SortKey,
  SortDirection,
} from "../../components/home/ComparisonTable";
import { IncomeChart } from "../../components/charts/IncomeChart";
import { AffordabilityTrendsChart } from "../../components/charts/AffordabilityTrendsChart";
import { MortgageBurdenChart } from "../../components/charts/MortgageBurdenChart";
import { PriceToRentChart } from "../../components/charts/PriceToRentChart";
import { TotalHouseholdsChart } from "../../components/charts/TotalHouseholdsChart";
import FloatingFlag from "../../components/ui/FloatingFlag";
import FloatingLanguageSelector from "../../components/ui/FloatingLanguageSelector";

export const runtime = "edge";

// Scenarios removed, using "Average Homebuyer" profile as default
const ltv = 90;
const term = 30;
const savingsRate = 10;

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("CAN");
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>({ key: "pti", direction: "ascending" });

  const countryData =
    affordabilityData[selectedCountry as keyof typeof affordabilityData];
  const countries = Object.keys(affordabilityData);
  const selectedCountryName =
    countryDisplayNames[selectedCountry as keyof typeof countryDisplayNames] ??
    selectedCountry;
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
            countryName:
              countryDisplayNames[
                countryCode as keyof typeof countryDisplayNames
              ] ?? countryCode,
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
          countryName:
            countryDisplayNames[
              countryCode as keyof typeof countryDisplayNames
            ] ?? countryCode,
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
        <FloatingLanguageSelector />
        <FloatingFlag
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
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
      <FloatingLanguageSelector />
      <FloatingFlag
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
      />
      <Hero />

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

      <ChartCard
        title="Real Household Income"
        chartComponent={
          <IncomeChart
            countryData={countryData}
            countryCode={selectedCountry}
          />
        }
        explanationTitle="What is this?"
        explanationContent={
          <>
            <p>
              This chart shows the inflation-adjusted{" "}
              <strong>disposable household income</strong> over time.
            </p>
            <p>
              An <strong>upward trend</strong> indicates that household
              purchasing power is increasing, which generally improves
              affordability. All figures are adjusted to 2015 currency values
              to provide a fair comparison across years.
            </p>
            <p>
              The income measured is &apos;equivalised,&apos; meaning it&apos;s
              adjusted for household size to better compare living standards.
            </p>
          </>
        }
      />

      <ChartCard
        title="Price-to-Income Ratio"
        chartComponent={
          <AffordabilityTrendsChart
            countryData={countryData}
            countryCode={selectedCountry}
          />
        }
        explanationTitle="What is this?"
        explanationContent={
          <>
            <p>
              This ratio shows how many years of{" "}
              <strong>gross household income</strong> it would take to buy an
              average home.
            </p>
            <p>
              A <strong>higher</strong> ratio means housing is{" "}
              <strong>less affordable</strong>. All data is inflation-adjusted
              to 2015 dollars for a fair comparison over time.
            </p>
          </>
        }
      />

      <ChartCard
        title="Mortgage Burden"
        chartComponent={
          <MortgageBurdenChart
            countryData={countryData}
            countryCode={selectedCountry}
            ltv={ltv}
            term={term}
            rate={latestMortgageRate}
          />
        }
        explanationTitle="What is this?"
        explanationContent={
          <>
            <p>
              This shows the percentage of{" "}
              <strong>gross household income</strong> needed to cover the
              monthly payment on an average home.
            </p>
            <p>
              A <strong>higher</strong> percentage means a greater financial
              burden. This chart calculates the burden for every year using the
              same recent interest rate for a fair comparison.
            </p>
            <p>
              The <strong>30% line</strong> represents a common affordability
              benchmark. Spending more than this is often considered "housing
              cost-burdened."
            </p>
          </>
        }
      />

      <ChartCard
        title="Price-to-Rent Index"
        chartComponent={<PriceToRentChart countryData={countryData} />}
        explanationTitle="What is this?"
        explanationContent={
          <>
            <p>
              This index measures the cost of buying a home relative to renting
              one. It's calculated by dividing the house price index by the rent
              price index.
            </p>
            <p>
              A <strong>higher</strong> index suggests that house prices are high
              relative to rental costs. This can indicate that it might be more
              financially advantageous to rent than to buy.
            </p>
            <p>
              The index is set to <strong>100 in 2015</strong>. Values above 100
              mean buying has become more expensive than renting compared to
              2015.
            </p>
          </>
        }
      />

      <ChartCard
        title="Total Households"
        chartComponent={<TotalHouseholdsChart countryData={countryData} />}
        explanationTitle="What is this?"
        explanationContent={
          <>
            <p>
              This chart shows the total number of households in the country
              over time.
            </p>
            <p>
              An <strong>increase</strong> in the number of households can be a
              significant driver of housing demand, often leading to upward
              pressure on prices and rents if supply does not keep pace.
            </p>
            <p>
              Factors like population growth, immigration, and changes in living
              arrangements (e.g., smaller household sizes) all contribute to
              this trend.
            </p>
          </>
        }
      />

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

      <CollapsibleSectionCard
        title="Asset Performance: Homeowner vs. Renter"
        subtitle="Compares which choice—buying or renting—could grow more wealth over time."
      >
        <AssetPerformanceSimulationCard
          currentHomePrice={housePrice}
          mortgageRate={latestMortgageRate}
          currency={currency.code}
        />
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        title="Personal Outcome Simulation"
        subtitle="Project your net worth based on your income"
      >
        <PersonalOutcomeSimulationCard
          defaultIncome={income}
          currentHomePrice={housePrice}
          mortgageRate={latestMortgageRate}
          currency={currency.code}
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