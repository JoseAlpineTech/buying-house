"use client";

import { AffordabilityTrendsChart } from "../charts/AffordabilityTrendsChart";
import { MortgageBurdenChart } from "../charts/MortgageBurdenChart";
import type { CountryData } from "../../data/affordability";

interface ChartsProps {
  countryData: CountryData;
  countryCode: string;
  ltv: number;
  term: number;
  savingsRate: number; // Pass this down for consistency if needed later
}

export default function Charts({
  countryData,
  countryCode,
  ltv,
  term,
}: ChartsProps) {
  return (
    <section className="mt-12 space-y-10">
      <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-6">
        <h3 className="chart-title mb-4">
          Calculated Real Price-to-Income Ratio (Inflation-Adjusted)
        </h3>
        <AffordabilityTrendsChart
          countryData={countryData}
          countryCode={countryCode}
        />
      </div>

      <div className="rounded-xl border border-[--color-border] bg-[--color-card] p-6">
        <h3 className="chart-title mb-4">
          Mortgage Burden Over Time (as % of Real Income)
        </h3>
        <MortgageBurdenChart
          countryData={countryData}
          countryCode={countryCode}
          ltv={ltv}
          term={term}
        />
      </div>
    </section>
  );
}