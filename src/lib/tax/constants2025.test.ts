import { test, expect } from 'vitest';
import {
  STANDARD_DEDUCTION_2025, SE, BRACKETS_2025,
} from './constants2025';

test('OBBBA TY2025 standard deductions', () => {
  expect(STANDARD_DEDUCTION_2025.single).toBe(15750);
  expect(STANDARD_DEDUCTION_2025.mfj).toBe(31500);
  expect(STANDARD_DEDUCTION_2025.hoh).toBe(23625);
});

test('SE / FICA constants', () => {
  expect(SE.netEarningsFactor).toBe(0.9235);
  expect(SE.socialSecurityRate).toBe(0.124);
  expect(SE.medicareRate).toBe(0.029);
  expect(SE.socialSecurityWageBase).toBe(176100);
  expect(SE.additionalMedicareRate).toBe(0.009);
});

test('bracket tables are well-formed (ascending, top = Infinity)', () => {
  for (const status of ['single', 'mfj', 'hoh'] as const) {
    const b = BRACKETS_2025[status];
    expect(b[b.length - 1].upTo).toBe(Infinity);
    for (let i = 1; i < b.length; i++) expect(b[i].upTo).toBeGreaterThan(b[i - 1].upTo);
  }
});

test('single bracket cut points', () => {
  expect(BRACKETS_2025.single.map((x) => x.upTo)).toEqual(
    [11925, 48475, 103350, 197300, 250525, 626350, Infinity],
  );
});
