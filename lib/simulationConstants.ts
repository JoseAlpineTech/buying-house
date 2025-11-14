// lib/simulationConstants.ts

import { SimulationAssumptions } from "./simulator";

export const DEFAULT_SIMULATION_ASSUMPTIONS: SimulationAssumptions = {
  // Conservative estimate for long-term, inflation-adjusted home price growth.
  annualHomePriceGrowth: 3.0,

  // Conservative estimate for long-term, inflation-adjusted stock market return (e.g., S&P 500 average).
  annualStockMarketReturn: 7.0,

  // Average long-term rental increase, often tracking slightly below or at inflation.
  annualRentIncrease: 2.0,

  // Standard estimate for annual costs (property tax, insurance, maintenance) as a percentage of home value.
  annualOwnershipCostRate: 1.5,

  // Represents the annual rent as a percentage of the home's value (Gross Rental Yield).
  // This sets the starting point for the renter's monthly costs. A 4% yield is a
  // common baseline for residential properties in many markets.
  initialRentalYield: 4.0,
};