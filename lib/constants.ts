// lib/constants.ts

/**
 * Representative base house price for the index base year (2015).
 * This value acts as an anchor to convert the price index into an estimated
 * monetary value for a given year. The values are in the local currency of the country.
 * These are broad estimates for a 'typical' home and are used for consistent
 * calculations across the time series.
 */
export const BASE_HOUSE_PRICES_2015: { readonly [countryCode: string]: number } = {
  AUS: 450000, // Australian Dollar
  AUT: 250000, // Euro
  BEL: 230000, // Euro
  CAN: 440000, // Canadian Dollar
  CHL: 55000000, // Chilean Peso
  COL: 250000000, // Colombian Peso
  CRI: 70000000, // Costa Rican Colón
  CZE: 2500000, // Czech Koruna
  DNK: 2000000, // Danish Krone
  EST: 120000, // Euro
  FIN: 240000, // Euro
  FRA: 220000, // Euro
  DEU: 220000, // Euro
  GRC: 150000, // Euro
  HUN: 15000000, // Hungarian Forint
  ISL: 40000000, // Icelandic Króna
  IRL: 200000, // Euro
  ISR: 1400000, // Israeli New Shekel
  ITA: 210000, // Euro
  JPN: 30000000, // Japanese Yen
  KOR: 350000000, // South Korean Won
  LVA: 80000, // Euro
  LTU: 100000, // Euro
  LUX: 450000, // Euro
  MEX: 1000000, // Mexican Peso
  NLD: 240000, // Euro
  NZL: 500000, // New Zealand Dollar
  NOR: 3000000, // Norwegian Krone
  POL: 300000, // Polish Złoty
  PRT: 150000, // Euro
  SVK: 110000, // Euro
  SVN: 160000, // Euro
  ESP: 180000, // Euro
  SWE: 2500000, // Swedish Krona
  CHE: 600000, // Swiss Franc
  TUR: 300000, // Turkish Lira
  GBR: 200000, // British Pound
  USA: 250000, // US Dollar
};