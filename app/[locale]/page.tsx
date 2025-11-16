"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
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
import FloatingFlag from "../../components/ui/FloatingFlag";
import FloatingLanguageSelector from "../../components/ui/FloatingLanguageSelector";
import FloatingThemeSelector from "../../components/ui/FloatingThemeSelector";
import FloatingControls from "../../components/ui/FloatingControls";

// Dynamically import chart components to code-split them
const IncomeChart = dynamic(
  () =>
    import("../../components/charts/IncomeChart").then((mod) => mod.IncomeChart),
  { ssr: false, loading: () => <div className="h-96" /> },
);
const AffordabilityTrendsChart = dynamic(
  () =>
    import("../../components/charts/AffordabilityTrendsChart").then(
      (mod) => mod.AffordabilityTrendsChart,
    ),
  { ssr: false, loading: () => <div className="h-96" /> },
);
const MortgageBurdenChart = dynamic(
  () =>
    import("../../components/charts/MortgageBurdenChart").then(
      (mod) => mod.MortgageBurdenChart,
    ),
  { ssr: false, loading: () => <div className="h-96" /> },
);
const PriceToRentChart = dynamic(
  () =>
    import("../../components/charts/PriceToRentChart").then(
      (mod) => mod.PriceToRentChart,
    ),
  { ssr: false, loading: () => <div className="h-96" /> },
);
const TotalHouseholdsChart = dynamic(
  () =>
    import("../../components/charts/TotalHouseholdsChart").then(
      (mod) => mod.TotalHouseholdsChart,
    ),
  { ssr: false, loading: () => <div className="h-96" /> },
);

export const runtime = "edge";

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
  } | null>({
    key: "pti",
    direction: "ascending",
  });

  const t = useTranslations();

  const countryData =
    affordabilityData[selectedCountry as keyof typeof affordabilityData];
  const countries = Object.keys(affordabilityData);

  const selectedCountryName =
    countryDisplayNames[selectedCountry as keyof typeof countryDisplayNames] ??
    selectedCountry;

  const currency =
    currencies[selectedCountry as keyof typeof currencies] ?? currencies.USA;

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
            year: endYear,
          };
        }

        const payment = calcMortgagePayment(rate, metrics.housePrice, ltv, term);
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
          year: endYear,
        };
      })
      .filter((x): x is ComparisonData => x !== null);
  }, []);

  const comparisonSubtitle = useMemo(() => {
    if (!sortConfig) return "";
    const label = t(`ComparisonTable.sortKeys.${sortConfig.key}`);
    const direction = t(`ComparisonTable.sortDirection.${sortConfig.direction}`);
    return t("Page.comparisonSubtitle", {
      label,
      direction,
    });
  }, [sortConfig, t]);

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
        <FloatingControls selectedCountry={selectedCountry}>
          <FloatingFlag
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={countries}
          />
          <FloatingLanguageSelector />
          <FloatingThemeSelector />
        </FloatingControls>

        <Hero />

        <div className="mt-12 text-center text-xl text-[--color-label]">
          <p>{t("Errors.noData", { countryName: selectedCountryName })}</p>
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

  const baseHousePrice = BASE_HOUSE_PRICES_2015[selectedCountry];
  const startIncome = countryData.realIncome[0]?.value;
  const endIncome = countryData.realIncome.slice(-1)[0]?.value;
  const startIndexValue = countryData.realHousePriceIndex[0]?.value;
  const endIndexValue = countryData.realHousePriceIndex.slice(-1)[0]?.value;

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-10">
      <FloatingControls selectedCountry={selectedCountry}>
        <FloatingFlag
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
        />
        <FloatingLanguageSelector />
        <FloatingThemeSelector />
      </FloatingControls>

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
        title={t("Page.chartCard_RealHouseholdIncome_title")}
        chartComponent={
          <IncomeChart
            countryData={countryData}
            countryCode={selectedCountry}
          />
        }
        explanationTitle={t("ChartCard.explanationTitle")}
        explanationContent={
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.incomeExplanation.p1"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.incomeExplanation.p2"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.incomeExplanation.p3"),
              }}
            />
          </>
        }
      />

      <ChartCard
        title={t("Page.chartCard_PriceToIncomeRatio_title")}
        chartComponent={
          <AffordabilityTrendsChart
            countryData={countryData}
            countryCode={selectedCountry}
          />
        }
        explanationTitle={t("ChartCard.explanationTitle")}
        explanationContent={
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.ptiExplanation.p1"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.ptiExplanation.p2"),
              }}
            />
          </>
        }
      />

      <ChartCard
        title={t("Page.chartCard_MortgageBurden_title")}
        chartComponent={
          <MortgageBurdenChart
            countryData={countryData}
            countryCode={selectedCountry}
            ltv={ltv}
            term={term}
            rate={latestMortgageRate}
          />
        }
        explanationTitle={t("ChartCard.explanationTitle")}
        explanationContent={
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.mortgageBurdenExplanation.p1"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.mortgageBurdenExplanation.p2"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.mortgageBurdenExplanation.p3"),
              }}
            />
          </>
        }
      />

      <ChartCard
        title={t("Page.chartCard_PriceToRentIndex_title")}
        chartComponent={<PriceToRentChart countryData={countryData} />}
        explanationTitle={t("ChartCard.explanationTitle")}
        explanationContent={
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.priceToRentExplanation.p1"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.priceToRentExplanation.p2"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.priceToRentExplanation.p3"),
              }}
            />
          </>
        }
      />

      <ChartCard
        title={t("Page.chartCard_TotalHouseholds_title")}
        chartComponent={<TotalHouseholdsChart countryData={countryData} />}
        explanationTitle={t("ChartCard.explanationTitle")}
        explanationContent={
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.totalHouseholdsExplanation.p1"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.totalHouseholdsExplanation.p2"),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("ChartCard.totalHouseholdsExplanation.p3"),
              }}
            />
          </>
        }
      />

      <CollapsibleSectionCard
        title={t("Page.collapsible_CountryComparison_title")}
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
        title={t("Page.collapsible_AssetPerformance_title")}
        subtitle={t("Page.collapsible_AssetPerformance_subtitle")}
      >
        <AssetPerformanceSimulationCard
          currentHomePrice={housePrice}
          mortgageRate={latestMortgageRate}
          currency={currency.code}
        />
      </CollapsibleSectionCard>

      <CollapsibleSectionCard
        title={t("Page.collapsible_PersonalOutcome_title")}
        subtitle={t("Page.collapsible_PersonalOutcome_subtitle")}
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