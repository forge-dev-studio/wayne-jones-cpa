import { test, expect } from 'vitest';
import { compareScorpVsLlc } from './scorp';

test('$120k profit, $60k salary, $2k added cost → ~$5,775 net savings', () => {
  const r = compareScorpVsLlc({ netProfit: 120000, reasonableSalary: 60000 });
  expect(r.llc.seTax).toBeCloseTo(16955.46, 2);
  expect(r.scorp.payrollTax).toBeCloseTo(9180, 2);
  expect(r.addedCost).toBe(2000); // default
  expect(r.netSavings).toBeCloseTo(16955.46 - 9180 - 2000, 2); // 5,775.46
});

test('salary >= profit → no distribution advantage (savings <= 0 after cost)', () => {
  const r = compareScorpVsLlc({ netProfit: 80000, reasonableSalary: 80000 });
  expect(r.scorp.distribution).toBe(0);
  expect(r.netSavings).toBeLessThan(0);
});

test('custom added cost is respected', () => {
  const r = compareScorpVsLlc({ netProfit: 120000, reasonableSalary: 60000, addedCost: 3500 });
  expect(r.addedCost).toBe(3500);
});
