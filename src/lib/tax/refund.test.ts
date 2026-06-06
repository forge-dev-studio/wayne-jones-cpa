import { test, expect } from 'vitest';
import { estimateRefund } from './refund';

test('single $65,000 wages, $15,750 std ded, $6,500 withheld → refund', () => {
  const r = estimateRefund({ status: 'single', income: 65000, withholding: 6500 });
  expect(r.taxableIncome).toBe(65000 - 15750); // 49,250
  // tax on 49,250 single = 11,925×.10 + (48,475−11,925)×.12 + (49,250−48,475)×.22
  //   = 1,192.50 + 4,386.00 + 170.50 = 5,749.00
  // NOTE: plan literal said 5749.5 but its third term (775×.22) is 170.50, so the
  // correct sum is 5749.00. Verified TY2025 single brackets confirm. Code is correct.
  expect(r.tax).toBeCloseTo(5749, 2);
  expect(r.balance).toBeCloseTo(6500 - 5749, 2); // +751.00 refund
});

test('itemized greater than standard is used', () => {
  const r = estimateRefund({ status: 'single', income: 65000, withholding: 0, itemized: 20000 });
  expect(r.taxableIncome).toBe(65000 - 20000);
});

test('credits reduce tax but not below zero balance owed past withholding', () => {
  const r = estimateRefund({ status: 'single', income: 65000, withholding: 6500, credits: 1000 });
  // 5,749.00 gross tax − 1,000 credit = 4,749.00 (see prior test's corrected derivation).
  expect(r.tax).toBeCloseTo(5749 - 1000, 2);
});
