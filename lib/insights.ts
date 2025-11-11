import { CountryData } from "../data/affordability";
import { calcYDP } from "./metrics";

export interface AffordabilityMetrics {
  pti: number;
  ydp: number;
  year: number;
}

/**
 * Generates a plain-language summary of affordability changes over time.
 * @param startMetrics - The metrics from the earliest available year.
 * @param endMetrics - The metrics from the most recent available year.
 * @returns A string summarizing the changes in affordability.
 */
export function generateAffordabilitySummary(
  startMetrics: AffordabilityMetrics,
  endMetrics: AffordabilityMetrics,
): string {
  if (!startMetrics || !endMetrics) {
    return "Insufficient data to generate a summary.";
  }

  const ptiChange =
    ((endMetrics.pti - startMetrics.pti) / startMetrics.pti) * 100;
  const ydpChange = endMetrics.ydp - startMetrics.ydp;

  let summary = `Between ${startMetrics.year} and ${endMetrics.year}, key affordability metrics have shifted. `;

  // PTI sentence
  if (Math.abs(ptiChange) < 1) {
    summary += `The price-to-income ratio remained stable. `;
  } else {
    summary += `The price-to-income ratio ${
      ptiChange > 0 ? "increased" : "decreased"
    } by ${Math.abs(ptiChange).toFixed(0)}%, from ${startMetrics.pti.toFixed(
      1,
    )} to ${endMetrics.pti.toFixed(1)}. `;
  }

  // YDP sentence
  if (Math.abs(ydpChange) < 0.5) {
    summary += `The time required to save for a down payment has not changed significantly.`;
  } else {
    summary += `The time to save for a down payment has ${
      ydpChange > 0 ? "lengthened" : "shortened"
    }, changing from ${startMetrics.ydp.toFixed(
      1,
    )} years to ${endMetrics.ydp.toFixed(1)} years.`;
  }

  return summary;
}

/**
 * A helper function to calculate metrics for a specific year from the dataset.
 */
export function getMetricsForYear(
  countryData: CountryData,
  year: number,
  ltv: number,
  savingsRate: number,
): AffordabilityMetrics | null {
  const ptiPoint = countryData.pti.find((p) => p.year === year);
  const incomePoint = countryData.income.find((i) => i.year === year);

  if (!ptiPoint || !incomePoint) return null;

  const housePrice = ptiPoint.value * incomePoint.value;
  const ydp = calcYDP(housePrice, ltv, incomePoint.value, savingsRate);

  return {
    pti: ptiPoint.value,
    ydp,
    year,
  };
}