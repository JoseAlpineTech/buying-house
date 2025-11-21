/**
 * Calculates the monthly mortgage payment.
 *
 * @param rate - The annual interest rate (e.g., 5.5 for 5.5%).
 * @param price - The total price of the property.
 * @param ltv - The Loan-to-Value ratio (e.g., 80 for 80%).
 * @param term - The loan term in years (e.g., 30).
 * @returns The calculated monthly mortgage payment.
 */
export function calcMortgagePayment(
  rate: number,
  price: number,
  ltv: number,
  term: number,
): number {
  const principal = price * (ltv / 100);
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = term * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
}

/**
 * Calculates the Mortgage Payment to Service (MPS) ratio.
 * This is the percentage of gross monthly income required for the mortgage payment.
 *
 * @param income - Gross annual income.
 * @param payment - Monthly mortgage payment.
 * @returns The MPS ratio as a percentage.
 */
export function calcMPS(income: number, payment: number): number {
  const monthlyIncome = income / 12;
  if (monthlyIncome === 0) {
    return Infinity;
  }
  return (payment / monthlyIncome) * 100;
}

/**
 * Calculates the Years to save for a Down Payment (YDP).
 *
 * @param price - The total price of the property.
 * @param downPaymentPct - The down payment percentage (e.g., 20 for 20%).
 * @param income - Gross annual income.
 * @param savingsRate - The percentage of annual income saved (e.g., 10 for 10%).
 * @returns The number of years required to save for the down payment.
 */
export function calcYDP(
  price: number,
  downPaymentPct: number,
  income: number,
  savingsRate: number,
): number {
  const downPaymentAmount = price * (downPaymentPct / 100);
  const annualSavings = income * (savingsRate / 100);

  if (annualSavings === 0) {
    return Infinity;
  }

  return downPaymentAmount / annualSavings;
}