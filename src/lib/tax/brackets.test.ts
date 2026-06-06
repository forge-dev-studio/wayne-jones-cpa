import { test, expect } from 'vitest';
import { computeIncomeTax, marginalRate } from './brackets';

test('single $50,000 taxable = $5,914.00', () => {
  // 11,925×.10 + (48,475−11,925)×.12 + (50,000−48,475)×.22
  expect(computeIncomeTax(50000, 'single')).toBeCloseTo(5914, 2);
});

test('zero / negative taxable income = $0', () => {
  expect(computeIncomeTax(0, 'single')).toBe(0);
  expect(computeIncomeTax(-5000, 'mfj')).toBe(0);
});

test('mfj $100,000 taxable = $11,828.00', () => {
  // 23,850×.10 + (96,950−23,850)×.12 + (100,000−96,950)×.22
  //   = 2,385.00 + 8,772.00 + 671.00 = 11,828.00
  // NOTE: plan literal said 11990 but its own per-bracket formula (above) and the
  // verified TY2025 MFJ cut points both yield 11828. 11990 would correspond to
  // ~$100,736 taxable, not $100,000. Code is correct; corrected the expected value.
  expect(computeIncomeTax(100000, 'mfj')).toBeCloseTo(11828, 2);
});

test('marginal rate reflects the top bracket reached', () => {
  expect(marginalRate(50000, 'single')).toBe(0.22);
  expect(marginalRate(10000, 'single')).toBe(0.10);
});
