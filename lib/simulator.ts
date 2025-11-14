import { calcMortgagePayment } from "./metrics";

export interface SimulationAssumptions {
  annualHomePriceGrowth: number;
  annualStockMarketReturn: number;
  annualRentIncrease: number;
  annualOwnershipCostRate: number;
  initialRentalYield: number;
}

export interface SimulationParams {
  downPayment: number;
  yearsToSimulate: number;
  currentHomePrice: number;
  mortgageRate: number;
  mortgageTerm: number;
  assumptions: SimulationAssumptions;
}

export interface HomeownerResult {
  finalHomeValue: number;
  remainingMortgage: number;
  homeEquity: number;
  totalMonthlyCost: number;
}

export interface RenterResult {
  initialInvestment: number;
  extraMonthlyInvestment: number;
  finalInvestmentValue: number;
}

export interface SimulationResult {
  homeowner: HomeownerResult;
  renter: RenterResult;
}

/**
 * Calculates the future value of a present sum.
 */
function futureValue(
  presentValue: number,
  monthlyRate: number,
  months: number,
): number {
  return presentValue * Math.pow(1 + monthlyRate, months);
}

/**
 * Calculates the future value of a series of regular payments (annuity).
 */
function futureValueOfAnnuity(
  payment: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) {
    return payment * months;
  }
  return payment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

/**
 * Calculates the remaining loan balance after a certain number of payments.
 */
function calculateRemainingMortgageBalance(
  principal: number,
  annualRate: number,
  termInYears: number,
  paymentsMade: number,
): number {
  if (annualRate === 0) {
    return principal - (principal / (termInYears * 12)) * paymentsMade;
  }
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termInYears * 12;

  const balance =
    principal *
    (Math.pow(1 + monthlyRate, totalPayments) -
      Math.pow(1 + monthlyRate, paymentsMade)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  return balance > 0 ? balance : 0;
}

/**
 * Calculates the financial outcome for the homeowner path.
 */
function calculateHomeownerPath(
  params: SimulationParams,
): { homeownerResult: HomeownerResult; monthlyMortgage: number } {
  const {
    currentHomePrice,
    downPayment,
    mortgageRate,
    mortgageTerm,
    yearsToSimulate,
    assumptions,
  } = params;
  const { annualHomePriceGrowth, annualOwnershipCostRate } = assumptions;

  const principal = currentHomePrice - downPayment;
  const monthlyMortgage = calcMortgagePayment(
    mortgageRate,
    currentHomePrice,
    (downPayment / currentHomePrice) * 100,
    mortgageTerm,
  );

  const finalHomeValue =
    currentHomePrice *
    Math.pow(1 + annualHomePriceGrowth / 100, yearsToSimulate);

  const remainingMortgage = calculateRemainingMortgageBalance(
    principal,
    mortgageRate,
    mortgageTerm,
    yearsToSimulate * 12,
  );

  const homeEquity = finalHomeValue - remainingMortgage;

  const monthlyOwnershipCost =
    (currentHomePrice * annualOwnershipCostRate) / 100 / 12;
  const totalMonthlyCost = monthlyMortgage + monthlyOwnershipCost;

  return {
    homeownerResult: {
      finalHomeValue,
      remainingMortgage,
      homeEquity,
      totalMonthlyCost,
    },
    monthlyMortgage, // Pass this for renter calculation
  };
}

/**
 * Calculates the financial outcome for the renter & investor path.
 * This version incorporates annual rent increases.
 */
function calculateRenterPath(
  params: SimulationParams,
  homeownerMonthlyCost: number,
): RenterResult {
  const {
    downPayment,
    yearsToSimulate,
    currentHomePrice,
    assumptions,
  } = params;
  const {
    annualStockMarketReturn,
    initialRentalYield,
    annualRentIncrease,
  } = assumptions;

  const monthlyMarketReturn = annualStockMarketReturn / 100 / 12;
  const initialMonthlyRent =
    (currentHomePrice * initialRentalYield) / 100 / 12;
  const numberOfMonths = yearsToSimulate * 12;

  let finalInvestmentValue = downPayment;
  let totalExtraInvested = 0;

  for (let month = 1; month <= numberOfMonths; month++) {
    // 1. Grow the existing investment portfolio
    finalInvestmentValue *= 1 + monthlyMarketReturn;

    // 2. Calculate this month's rent (it increases annually)
    const currentYear = Math.floor((month - 1) / 12);
    const currentMonthlyRent =
      initialMonthlyRent * Math.pow(1 + annualRentIncrease / 100, currentYear);

    // 3. Calculate how much extra money the renter has this month
    const extraInvestmentThisMonth = homeownerMonthlyCost - currentMonthlyRent;

    // 4. Add the extra savings to the portfolio, if any
    if (extraInvestmentThisMonth > 0) {
      finalInvestmentValue += extraInvestmentThisMonth;
      totalExtraInvested += extraInvestmentThisMonth;
    }
  }

  // For the UI, we'll show the average monthly savings
  const averageMonthlyInvestment =
    numberOfMonths > 0 ? totalExtraInvested / numberOfMonths : 0;

  return {
    initialInvestment: downPayment,
    extraMonthlyInvestment: averageMonthlyInvestment, // This is now an average
    finalInvestmentValue,
  };
}

/**
 * Runs the full "Buy vs. Rent" simulation.
 */
export function runSimulation(params: SimulationParams): SimulationResult {
  const { homeownerResult } = calculateHomeownerPath(params);

  const renterResult = calculateRenterPath(
    params,
    homeownerResult.totalMonthlyCost,
  );

  return {
    homeowner: homeownerResult,
    renter: renterResult,
  };
}

// --- NEW: Personal Outcome Simulation ---

export interface PersonalOutcomeParams {
  customIncome: number;
  savingsRate: number; // as a percentage, e.g., 15
  downPayment: number;
  yearsToSimulate: number;
  currentHomePrice: number;
  mortgageRate: number;
  mortgageTerm: number;
  assumptions: SimulationAssumptions;
}

export interface PersonalOutcomeResult {
  homeownerNetWorth: number;
  renterNetWorth: number;
}

/**
 * Runs a simulation based on a user's income and savings rate.
 * This compares the net worth of a homeowner (equity) vs. a renter (investments).
 */
export function runPersonalOutcomeSimulation(
  params: PersonalOutcomeParams,
): PersonalOutcomeResult {
  const {
    customIncome,
    savingsRate,
    downPayment,
    yearsToSimulate,
    currentHomePrice,
    mortgageRate,
    mortgageTerm,
    assumptions,
  } = params;

  // --- 1. Renter's Path ---
  // The renter invests their down payment plus a percentage of their income every month.
  const monthlySavings = (customIncome * (savingsRate / 100)) / 12;
  const monthlyMarketReturn = assumptions.annualStockMarketReturn / 100 / 12;
  const numberOfMonths = yearsToSimulate * 12;

  const fvOfDownPayment = futureValue(
    downPayment,
    monthlyMarketReturn,
    numberOfMonths,
  );
  const fvOfSavings = futureValueOfAnnuity(
    monthlySavings,
    monthlyMarketReturn,
    numberOfMonths,
  );
  const renterNetWorth = fvOfDownPayment + fvOfSavings;

  // --- 2. Homeowner's Path ---
  // The homeowner's net worth is primarily their home equity. This model assumes
  // their savings are directed towards the mortgage and homeownership costs.
  const principal = currentHomePrice - downPayment;
  const finalHomeValue =
    currentHomePrice *
    Math.pow(1 + assumptions.annualHomePriceGrowth / 100, yearsToSimulate);
  const remainingMortgage = calculateRemainingMortgageBalance(
    principal,
    mortgageRate,
    mortgageTerm,
    numberOfMonths,
  );
  const homeownerNetWorth = finalHomeValue - remainingMortgage;

  return {
    homeownerNetWorth,
    renterNetWorth,
  };
}