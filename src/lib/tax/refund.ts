import { computeIncomeTax, marginalRate } from './brackets';
import { STANDARD_DEDUCTION_2025, type FilingStatus } from './constants2025';

export interface RefundInput {
  status: FilingStatus;
  income: number;
  withholding: number;
  adjustments?: number;
  itemized?: number;
  credits?: number;
}

export interface RefundResult {
  agi: number;
  deduction: number;
  taxableIncome: number;
  tax: number;
  effectiveRate: number;
  marginalRate: number;
  /** Positive = refund, negative = balance due. */
  balance: number;
}

export function estimateRefund(input: RefundInput): RefundResult {
  const income = Math.max(0, input.income);
  const adjustments = Math.max(0, input.adjustments ?? 0);
  const agi = Math.max(0, income - adjustments);
  const deduction = Math.max(STANDARD_DEDUCTION_2025[input.status], Math.max(0, input.itemized ?? 0));
  const taxableIncome = Math.max(0, agi - deduction);
  const grossTax = computeIncomeTax(taxableIncome, input.status);
  const tax = Math.max(0, grossTax - Math.max(0, input.credits ?? 0));
  const effectiveRate = agi > 0 ? tax / agi : 0;
  const balance = Math.max(0, input.withholding) - tax;
  return { agi, deduction, taxableIncome, tax, effectiveRate, marginalRate: marginalRate(taxableIncome, input.status), balance };
}
