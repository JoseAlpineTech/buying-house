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
 * Selects representative countries for comparison: Top 2, Median, Bottom 2.
 *
 * @param allData - The full dataset of countries.
 * @param excludeCode - The country code to exclude (the currently selected one).
 * @param metricFn - A function to extract the value to sort by (e.g. latest PTI).
 * @returns An array of 5 country codes.
 */
export function getRepresentativeCountries(
  allData: Record<string, CountryData>,
  excludeCode: string,
  metricFn: (data: CountryData) => number | null,
): string[] {
  const countryMetrics = Object.entries(allData)
    .filter(([code]) => code !== excludeCode)
    .map(([code, data]) => ({
      code,
      value: metricFn(data),
    }))
    .filter((item): item is { code: string; value: number } => item.value !== null)
    .sort((a, b) => b.value - a.value); // Descending sort

  if (countryMetrics.length < 5) {
    return countryMetrics.map((c) => c.code);
  }

  const top2 = countryMetrics.slice(0, 2);
  const bottom2 = countryMetrics.slice(-2);
  const medianIndex = Math.floor(countryMetrics.length / 2);
  const median = countryMetrics[medianIndex];

  // Return unique set in case of small datasets (though <5 check covers mostly)
  return Array.from(
    new Set([...top2, median, ...bottom2].map((c) => c.code)),
  );
}

// ... (Rest of the file remains unchanged, providing full file below)

function calculateHousePrice(
  year: number,
  countryData: CountryData,
  basePrice2015: number,
): number | null {
  const priceIndexCurrentYear = countryData.realHousePriceIndex.find(
    (p) => p.year === year,
  );

  let priceIndexBaseYear = countryData.realHousePriceIndex.find(
    (p) => p.year === 2015,
  );

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

  return (
    basePrice2015 * (priceIndexCurrentYear.value / priceIndexBaseYear.value)
  );
}

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