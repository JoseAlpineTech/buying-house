// lib/constants.ts

/**
 * Representative base house price for the index base year (2015).
 * This value acts as an anchor to convert the price index into an estimated
 * monetary value. The values are in the local currency of the country.
 * These are grounded estimates for a 'typical' home used for consistent calculations.
 */
export const BASE_HOUSE_PRICES_2015: {
  readonly [countryCode: string]: {
    readonly price: number;
    readonly source: string;
  };
} = {
  // Key countries with specific, high-quality sources
  USA: {
    price: 295000,
    source: "FRED, Median Sales Price of Houses Sold for the United States (MSPUS), Q4 2015",
  },
  CAN: {
    price: 440000,
    source: "CREA (Canadian Real Estate Association), Average Price Statistics, 2015",
  },
  GBR: {
    price: 198000,
    source: "ONS (Office for National Statistics), UK House Price Index, Dec 2015",
  },
  AUS: {
    price: 450000,
    source: "ABS (Australian Bureau of Statistics), Residential Property Price Indexes, 2015",
  },
  DEU: {
    price: 240000,
    source: "Destatis, German real estate market statistics, 2015",
  },

  // Other countries with general attribution (can be refined if needed)
  AUT: { price: 250000, source: "OECD, National sources (estimate)" },
  BEL: { price: 230000, source: "OECD, National sources (estimate)" },
  CHL: { price: 55000000, source: "OECD, National sources (estimate)" },
  COL: { price: 250000000, source: "OECD, National sources (estimate)" },
  CRI: { price: 70000000, source: "OECD, National sources (estimate)" },
  CZE: { price: 2500000, source: "OECD, National sources (estimate)" },
  DNK: { price: 2000000, source: "OECD, National sources (estimate)" },
  EST: { price: 120000, source: "OECD, National sources (estimate)" },
  FIN: { price: 240000, source: "OECD, National sources (estimate)" },
  FRA: { price: 220000, source: "OECD, National sources (estimate)" },
  GRC: { price: 150000, source: "OECD, National sources (estimate)" },
  HUN: { price: 15000000, source: "OECD, National sources (estimate)" },
  ISL: { price: 40000000, source: "OECD, National sources (estimate)" },
  IRL: { price: 200000, source: "OECD, National sources (estimate)" },
  ISR: { price: 1400000, source: "OECD, National sources (estimate)" },
  ITA: { price: 210000, source: "OECD, National sources (estimate)" },
  JPN: { price: 30000000, source: "OECD, National sources (estimate)" },
  KOR: { price: 350000000, source: "OECD, National sources (estimate)" },
  LVA: { price: 80000, source: "OECD, National sources (estimate)" },
  LTU: { price: 100000, source: "OECD, National sources (estimate)" },
  LUX: { price: 450000, source: "OECD, National sources (estimate)" },
  MEX: { price: 1000000, source: "OECD, National sources (estimate)" },
  NLD: { price: 240000, source: "OECD, National sources (estimate)" },
  NZL: { price: 500000, source: "OECD, National sources (estimate)" },
  NOR: { price: 3000000, source: "OECD, National sources (estimate)" },
  POL: { price: 300000, source: "OECD, National sources (estimate)" },
  PRT: { price: 150000, source: "OECD, National sources (estimate)" },
  SVK: { price: 110000, source: "OECD, National sources (estimate)" },
  SVN: { price: 160000, source: "OECD, National sources (estimate)" },
  ESP: { price: 180000, source: "OECD, National sources (estimate)" },
  SWE: { price: 2500000, source: "OECD, National sources (estimate)" },
  CHE: { price: 600000, source: "OECD, National sources (estimate)" },
  TUR: { price: 300000, source: "OECD, National sources (estimate)" },
};