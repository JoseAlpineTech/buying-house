import { CountryData } from "../data/affordability";
import { BASE_HOUSE_PRICES_2015 } from "./constants";

export interface AffordabilityMetrics {
  year: number;
  housePrice: number;
  income: number;
  pti: number; // Price-to-Income Ratio
}

export interface AffordabilitySummaryData {
  startPti: number;
  startYear: number;
  endPti: number;
  endYear: number;
  ptiChange: number;
  ptiPercentageChange: number;
}

/**
 * Calculates a representative house price for a given year using the index.
 * This function is now robust and uses the first available year as the base
 * if the default base year (2015) is not present in the data.
 *
 * @param year - The target year for the calculation.
 * @param countryData - The dataset for the selected country.
 * @param basePrice2015 - The anchor house price for the year 2015.
 * @returns The calculated representative house price, or null if data is insufficient.
 */
function calculateHousePrice(
  year: number,
  countryData: CountryData,
  basePrice2015: number,
): number | null {
  const priceIndexCurrentYear = countryData.realHousePriceIndex.find(
    (p) => p.year === year,
  );

  // Try to find the 2015 base year index.
  let priceIndexBaseYear = countryData.realHousePriceIndex.find(
    (p) => p.year === 2015,
  );

  // --- Fallback Mechanism ---
  // If 2015 data is not available, use the first year in the dataset as the base.
  // This makes the calculation resilient for countries with different data ranges.
  if (!priceIndexBaseYear && countryData.realHousePriceIndex.length > 0) {
    priceIndexBaseYear = countryData.realHousePriceIndex[0];
  }

  if (
    !priceIndexCurrentYear ||
    !priceIndexBaseYear ||
    priceIndexBaseYear.value === 0
  ) {
    return null;
  }

  // The logic remains the same: scale the 2015 base price by the index change.
  return (
    basePrice2015 * (priceIndexCurrentYear.value / priceIndexBaseYear.value)
  );
}

/**
 * Generates calculated affordability metrics for comparison.
 * @param startMetrics - The calculated metrics from the earliest available year.
 * @param endMetrics - The calculated metrics from the most recent available year.
 * @returns Structured data representing the changes, or null if inputs are missing.
 */
export function generateAffordabilitySummary(
  startMetrics: AffordabilityMetrics,
  endMetrics: AffordabilityMetrics,
): AffordabilitySummaryData | null {
  if (!startMetrics || !endMetrics) {
    return null;
  }

  const ptiChange = endMetrics.pti - startMetrics.pti;
  const ptiPercentageChange =
    ((endMetrics.pti - startMetrics.pti) / startMetrics.pti) * 100;

  return {
    startPti: startMetrics.pti,
    startYear: startMetrics.year,
    endPti: endMetrics.pti,
    endYear: endMetrics.year,
    ptiChange,
    ptiPercentageChange,
  };
}

/**
 * A helper function to get calculated metrics for a specific year from the dataset.
 */
export function getMetricsForYear(
  countryData: CountryData,
  year: number,
  countryCode: string,
): AffordabilityMetrics | null {
  const basePriceData = BASE_HOUSE_PRICES_2015[countryCode];
  if (!basePriceData) return null;

  const incomePoint = countryData.realIncome.find((p) => p.year === year);
  if (!incomePoint || incomePoint.value === 0) return null;

  const housePrice = calculateHousePrice(
    year,
    countryData,
    basePriceData.price,
  );
  if (housePrice === null) return null;

  return {
    year,
    housePrice,
    income: incomePoint.value,
    pti: housePrice / incomePoint.value,
  };
}