import { test, expect } from 'vitest';
import { computeSeTax } from './seTax';

test('$100,000 net profit (single) → SE tax $14,129.55', () => {
  const r = computeSeTax(100000, 'single');
  expect(r.netSeEarnings).toBeCloseTo(92350, 2);
  expect(r.socialSecurity).toBeCloseTo(11451.4, 2);
  expect(r.medicare).toBeCloseTo(2678.15, 2);
  expect(r.additionalMedicare).toBe(0);
  expect(r.total).toBeCloseTo(14129.55, 2);
  expect(r.halfDeduction).toBeCloseTo(7064.775, 2);
});

test('Social Security portion caps at the wage base', () => {
  // profit so high that net SE earnings exceed 176,100
  const r = computeSeTax(300000, 'single');
  expect(r.socialSecurity).toBeCloseTo(176100 * 0.124, 2); // 21,836.40
});

test('additional 0.9% Medicare applies above threshold', () => {
  // single threshold 200,000; net earnings = 250,000×.9235 = 230,875 > 200,000
  const r = computeSeTax(250000, 'single');
  expect(r.additionalMedicare).toBeCloseTo((230875 - 200000) * 0.009, 2);
});

test('zero profit → all zeros', () => {
  const r = computeSeTax(0, 'mfj');
  expect(r.total).toBe(0);
});
