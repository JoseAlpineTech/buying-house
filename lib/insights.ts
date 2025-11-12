import { CountryData } from "../data/affordability";
import { BASE_HOUSE_PRICES_2015 } from "./constants";

export interface AffordabilityMetrics {
  year: number;
  housePrice: number;
  income: number;
  pti: number; // Price-to-Income Ratio
}

/**
 * Calculates a representative house price for a given year using the index.
 * @param year - The target year.
 * @param countryData - The dataset for the selected country.
 * @param basePrice - The anchor house price for the base year (2015).
 * @returns The calculated representative house price.
 */
function calculateHousePrice(
  year: number,
  countryData: CountryData,
  basePrice: number,
): number | null {
  const priceIndexCurrentYear = countryData.realHousePriceIndex.find(
    (p) => p.year === year,
  );
  const priceIndexBaseYear = countryData.realHousePriceIndex.find(
    (p) => p.year === 2015,
  );

  if (!priceIndexCurrentYear || !priceIndexBaseYear || priceIndexBaseYear.value === 0) {
    return null;
  }

  return (
    basePrice * (priceIndexCurrentYear.value / priceIndexBaseYear.value)
  );
}

/**
 * Generates a plain-language summary based on calculated affordability changes.
 * @param startMetrics - The calculated metrics from the earliest available year.
 * @param endMetrics - The calculated metrics from the most recent available year.
 * @returns A list of strings summarizing the key changes.
 */
export function generateAffordabilitySummary(
  startMetrics: AffordabilityMetrics,
  endMetrics: AffordabilityMetrics,
): string[] {
  if (!startMetrics || !endMetrics) {
    return [];
  }

  const ptiChange = endMetrics.pti - startMetrics.pti;
  const ptiPercentageChange =
    ((endMetrics.pti - startMetrics.pti) / startMetrics.pti) * 100;

  const insights: string[] = [];

  // Insight 1: PTI Change
  insights.push(
    `The calculated Real Price-to-Income ratio has ${
      ptiChange > 0 ? "worsened" : "improved"
    } from **${startMetrics.pti.toFixed(1)}** in ${
      startMetrics.year
    } to **${endMetrics.pti.toFixed(1)}** in ${endMetrics.year}.`,
  );

  // Insight 2: Contextualize the change
  insights.push(
    `This indicates that, in inflation-adjusted terms, housing has become **${Math.abs(
      ptiPercentageChange,
    ).toFixed(0)}%** ${
      ptiChange > 0 ? "less affordable" : "more affordable"
    } for the average household.`,
  );

  return insights;
}

/**
 * A helper function to get calculated metrics for a specific year from the dataset.
 */
export function getMetricsForYear(
  countryData: CountryData,
  year: number,
  countryCode: string,
): AffordabilityMetrics | null {
  const basePrice = BASE_HOUSE_PRICES_2015[countryCode];
  if (!basePrice) return null;

  const incomePoint = countryData.realIncome.find((p) => p.year === year);
  if (!incomePoint || incomePoint.value === 0) return null;

  const housePrice = calculateHousePrice(year, countryData, basePrice);
  if (housePrice === null) return null;

  return {
    year,
    housePrice,
    income: incomePoint.value,
    pti: housePrice / incomePoint.value,
  };
}