import { BRACKETS_2025, type FilingStatus } from './constants2025';

/** Progressive federal income tax on taxable income for TY2025. */
export function computeIncomeTax(taxableIncome: number, status: FilingStatus): number {
  const income = Math.max(0, taxableIncome);
  let tax = 0;
  let lower = 0;
  for (const bracket of BRACKETS_2025[status]) {
    if (income <= lower) break;
    const upper = Math.min(income, bracket.upTo);
    tax += (upper - lower) * bracket.rate;
    lower = bracket.upTo;
  }
  return tax;
}

/** The marginal rate (highest bracket the income reaches). */
export function marginalRate(taxableIncome: number, status: FilingStatus): number {
  const income = Math.max(0, taxableIncome);
  let rate = BRACKETS_2025[status][0].rate;
  let lower = 0;
  for (const bracket of BRACKETS_2025[status]) {
    if (income > lower) rate = bracket.rate;
    lower = bracket.upTo;
  }
  return rate;
}
