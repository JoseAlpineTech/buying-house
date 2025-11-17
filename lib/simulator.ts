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

function futureValue(
  presentValue: number,
  monthlyRate: number,
  months: number,
): number {
  return presentValue * Math.pow(1 + monthlyRate, months);
}

function futureValueOfAnnuity(
  payment: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) return payment * months;
  return payment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

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
    monthlyMortgage,
  };
}

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
    finalInvestmentValue *= 1 + monthlyMarketReturn;

    const currentYear = Math.floor((month - 1) / 12);
    const currentMonthlyRent =
      initialMonthlyRent * Math.pow(1 + annualRentIncrease / 100, currentYear);

    const extraInvestmentThisMonth = homeownerMonthlyCost - currentMonthlyRent;

    if (extraInvestmentThisMonth > 0) {
      finalInvestmentValue += extraInvestmentThisMonth;
      totalExtraInvested += extraInvestmentThisMonth;
    }
  }

  return {
    initialInvestment: downPayment,
    extraMonthlyInvestment:
      numberOfMonths > 0 ? totalExtraInvested / numberOfMonths : 0,
    finalInvestmentValue,
  };
}

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

// ---------------------------------------------------------------------------
// PERSONAL OUTCOME SIMULATION — UPDATED (monthlySavings replaces savingsRate)
// ---------------------------------------------------------------------------

export interface PersonalOutcomeParams {
  customIncome: number;
  monthlySavings: number;
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

export function runPersonalOutcomeSimulation(
  params: PersonalOutcomeParams,
): PersonalOutcomeResult {
  const {
    monthlySavings,
    downPayment,
    yearsToSimulate,
    currentHomePrice,
    mortgageRate,
    mortgageTerm,
    assumptions,
  } = params;

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
