# Wayne Jones CPA — "10x" Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the brochure site into a lead engine — interactive TY2025 tax calculators, a conversion layer (booking CTA scaffold, sticky mobile call bar, resources/lead-magnets), and a trust layer (credentials bar, tightened hero) — all static, all preserving the Engraved design.

**Architecture:** Pure, unit-tested TS tax module (`src/lib/tax/`) shared between Vitest tests and Astro client `<script>` bundles. Each calculator is an Astro component + page; math never lives in the UI. Conversion/trust are reusable Astro components wired through the existing `SITE`/`NAV` config and `href()` base-helper. No backend; graceful no-JS degradation everywhere.

**Tech Stack:** Astro 4 (static), TypeScript, Vitest (new), vanilla client TS (no UI framework), Playwright (existing, for PDF + visual QA), existing engraved `global.css` tokens.

**Spec:** `docs/superpowers/specs/2026-06-06-wayne-jones-10x-phase1-design.md` (Appendix A = verified TY2025 constants + worked examples).

**Critical rule:** Tax math is built **test-first** against the worked examples. Every constant in `constants2025.ts` carries a source comment. If a figure can't be confirmed, pause and flag — never guess.

---

## File Structure

**New — tax math (pure, tested):**
- `src/lib/tax/constants2025.ts` — `FilingStatus`, `Bracket`, brackets, standard deduction, SE/FICA constants (sourced).
- `src/lib/tax/format.ts` — `formatUSD`, `formatPct` (shared by tests + client).
- `src/lib/tax/brackets.ts` — `computeIncomeTax`, `marginalRate`.
- `src/lib/tax/seTax.ts` — `computeSeTax`.
- `src/lib/tax/refund.ts` — `estimateRefund`.
- `src/lib/tax/scorp.ts` — `compareScorpVsLlc`.
- `src/lib/tax/index.ts` — barrel re-export.
- `src/lib/tax/*.test.ts` — Vitest unit tests (one per module).

**New — UI:**
- `src/components/TaxDisclaimer.astro`
- `src/components/BookConsult.astro`
- `src/components/TrustBar.astro`
- `src/components/StickyCallBar.astro`
- `src/components/calculators/RefundEstimator.astro`
- `src/components/calculators/SelfEmploymentCalculator.astro`
- `src/components/calculators/ScorpCalculator.astro`
- `src/pages/tax-tools/index.astro`
- `src/pages/tax-tools/tax-refund-estimator.astro`
- `src/pages/tax-tools/self-employment-tax-calculator.astro`
- `src/pages/tax-tools/s-corp-vs-llc-calculator.astro`
- `src/pages/resources/index.astro`
- `public/resources/2026-tax-deadline-calendar.pdf`
- `public/resources/small-business-tax-prep-checklist.pdf`
- `previews/assets/pdf-deadlines.html`, `previews/assets/pdf-checklist.html`, `previews/gen-pdfs.cjs`

**Modified:**
- `package.json` — vitest devDep + `test` script.
- `vitest.config.ts` (new, root).
- `src/config.ts` — add `BOOKING_URL`, `bookingIsExternal`; add `{ label: 'Tax Tools', href: '/tax-tools/' }` to `NAV`.
- `src/components/sections/Hero.astro` — CTA copy + `BookConsult`.
- `src/layouts/BaseLayout.astro` — render `<StickyCallBar />`.
- `src/pages/index.astro` — render `<TrustBar />` after hero.
- `src/styles/global.css` — calculator + trust-bar + sticky-bar + tax-tools styles (append, reuse tokens).

**Existing tokens to reuse** (from `global.css`): `--ink`, `--ink-muted`, `--gold-text` (AA-safe), `--gold`, `--oxblood`, `--ivory`, `--ivory-surface`, `--navy`, `--font-display` (Fraunces), `--font-body` (Spectral), `--ease`, `--shadow-panel`, `--max-w`, `--max-w-prose`. Layout: `.section-wrap`, `.section-wrap--prose`. Reveal: `.reveal` + `data-reveal` + `style="--d:N"`.

---

## Task 1: Add Vitest test tooling

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Add vitest devDependency + test script**

In `package.json`, add to `scripts`: `"test": "vitest run"`, `"test:watch": "vitest"`. Add to `devDependencies`: `"vitest": "^2.1.0"`. Then run:

```bash
cd ~/wayne-jones-cpa && npm install
```
Expected: installs vitest, `node_modules/.bin/vitest` exists.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Smoke-test the runner**

Create a temporary `src/lib/tax/smoke.test.ts`:
```ts
import { test, expect } from 'vitest';
test('vitest runs', () => { expect(1 + 1).toBe(2); });
```
Run: `npm test`
Expected: 1 passed. Then delete `src/lib/tax/smoke.test.ts`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.ts && git commit -m "build: add Vitest for tax-math unit tests"
```

---

## Task 2: Tax constants + types (TY2025, sourced)

**Files:**
- Create: `src/lib/tax/constants2025.ts`
- Create: `src/lib/tax/constants2025.test.ts`

- [ ] **Step 1: Write the guard test** (locks the verified figures so an accidental edit fails CI)

`src/lib/tax/constants2025.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL (`Cannot find module './constants2025'`).

- [ ] **Step 3: Implement `constants2025.ts`**

```ts
// All figures = U.S. federal Tax Year 2025. Sources in comments.
// Verified 2026-06-06 against IRS / SSA / Tax Foundation.

export type FilingStatus = 'single' | 'mfj' | 'hoh';

export interface Bracket {
  rate: number;
  /** Upper bound of this bracket's taxable income (Infinity for the top bracket). */
  upTo: number;
}

// Income-tax brackets — Rev. Proc. 2024-40; OBBBA retained the TCJA rate schedule.
export const BRACKETS_2025: Record<FilingStatus, Bracket[]> = {
  single: [
    { rate: 0.10, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: Infinity },
  ],
  mfj: [
    { rate: 0.10, upTo: 23850 },
    { rate: 0.12, upTo: 96950 },
    { rate: 0.22, upTo: 206700 },
    { rate: 0.24, upTo: 394600 },
    { rate: 0.32, upTo: 501050 },
    { rate: 0.35, upTo: 751600 },
    { rate: 0.37, upTo: Infinity },
  ],
  hoh: [
    { rate: 0.10, upTo: 17000 },
    { rate: 0.12, upTo: 64850 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250500 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: Infinity },
  ],
};

// Standard deduction — TY2025 per the One Big Beautiful Bill Act (raised above inflation-only figures).
export const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15750,
  mfj: 31500,
  hoh: 23625,
};

// Self-employment + FICA — IRS Schedule SE / Topic 751 / Topic 560; SSA wage base.
export const SE = {
  netEarningsFactor: 0.9235,        // Schedule SE line: net profit × 92.35%
  socialSecurityRate: 0.124,        // 12.4% (self-employed pays both halves)
  medicareRate: 0.029,              // 2.9%
  socialSecurityWageBase: 176100,   // SSA 2025 contribution & benefit base
  additionalMedicareRate: 0.009,    // +0.9% over threshold (Form 8959)
  additionalMedicareThreshold: { single: 200000, mfj: 250000, hoh: 200000 } as Record<FilingStatus, number>,
};

// Combined employer+employee payroll tax on S-corp W-2 wages.
export const FICA = {
  socialSecurityRate: 0.124,
  medicareRate: 0.029,
  socialSecurityWageBase: 176100,
};

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  mfj: 'Married filing jointly',
  hoh: 'Head of household',
};
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tax/constants2025.ts src/lib/tax/constants2025.test.ts && git commit -m "feat(tax): verified TY2025 constants with guard tests"
```

---

## Task 3: Income-tax bracket math (TDD)

**Files:**
- Create: `src/lib/tax/brackets.ts`
- Create: `src/lib/tax/brackets.test.ts`

- [ ] **Step 1: Write failing tests** (worked examples)

`src/lib/tax/brackets.test.ts`:
```ts
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

test('mfj $100,000 taxable = $11,990.00', () => {
  // 23,850×.10 + (96,950−23,850)×.12 + (100,000−96,950)×.22
  expect(computeIncomeTax(100000, 'mfj')).toBeCloseTo(11990, 2);
});

test('marginal rate reflects the top bracket reached', () => {
  expect(marginalRate(50000, 'single')).toBe(0.22);
  expect(marginalRate(10000, 'single')).toBe(0.10);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test src/lib/tax/brackets.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `brackets.ts`**

```ts
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
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test src/lib/tax/brackets.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tax/brackets.ts src/lib/tax/brackets.test.ts && git commit -m "feat(tax): progressive income-tax + marginal-rate functions (TDD)"
```

---

## Task 4: Self-employment tax math (TDD)

**Files:**
- Create: `src/lib/tax/seTax.ts`
- Create: `src/lib/tax/seTax.test.ts`

- [ ] **Step 1: Write failing tests**

`src/lib/tax/seTax.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test src/lib/tax/seTax.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `seTax.ts`**

```ts
import { SE, type FilingStatus } from './constants2025';

export interface SeTaxResult {
  netSeEarnings: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  total: number;
  /** Half of SE tax (excluding the additional Medicare) — deductible for income tax. */
  halfDeduction: number;
}

export function computeSeTax(
  netProfit: number,
  status: FilingStatus,
  w2SocialSecurityWages = 0,
): SeTaxResult {
  const profit = Math.max(0, netProfit);
  const netSeEarnings = profit * SE.netEarningsFactor;
  if (netSeEarnings <= 0) {
    return { netSeEarnings: 0, socialSecurity: 0, medicare: 0, additionalMedicare: 0, total: 0, halfDeduction: 0 };
  }
  const ssBaseRemaining = Math.max(0, SE.socialSecurityWageBase - Math.max(0, w2SocialSecurityWages));
  const socialSecurity = Math.min(netSeEarnings, ssBaseRemaining) * SE.socialSecurityRate;
  const medicare = netSeEarnings * SE.medicareRate;
  const threshold = SE.additionalMedicareThreshold[status];
  const additionalMedicare = Math.max(0, netSeEarnings - threshold) * SE.additionalMedicareRate;
  const regularSeTax = socialSecurity + medicare;
  const total = regularSeTax + additionalMedicare;
  // The deductible half excludes the additional-Medicare component.
  const halfDeduction = regularSeTax / 2;
  return { netSeEarnings, socialSecurity, medicare, additionalMedicare, total, halfDeduction };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test src/lib/tax/seTax.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tax/seTax.ts src/lib/tax/seTax.test.ts && git commit -m "feat(tax): self-employment tax (wage-base cap, addl Medicare) (TDD)"
```

---

## Task 5: Refund estimator + S-corp comparison math (TDD)

**Files:**
- Create: `src/lib/tax/refund.ts`, `src/lib/tax/refund.test.ts`
- Create: `src/lib/tax/scorp.ts`, `src/lib/tax/scorp.test.ts`

- [ ] **Step 1: Write failing tests — refund**

`src/lib/tax/refund.test.ts`:
```ts
import { test, expect } from 'vitest';
import { estimateRefund } from './refund';

test('single $65,000 wages, $15,750 std ded, $6,500 withheld → refund', () => {
  const r = estimateRefund({ status: 'single', income: 65000, withholding: 6500 });
  expect(r.taxableIncome).toBe(65000 - 15750); // 49,250
  // tax on 49,250 single = 11,925×.10 + (48,475−11,925)×.12 + (49,250−48,475)×.22 = 5,749.50
  expect(r.tax).toBeCloseTo(5749.5, 2);
  expect(r.balance).toBeCloseTo(6500 - 5749.5, 2); // +750.50 refund
});

test('itemized greater than standard is used', () => {
  const r = estimateRefund({ status: 'single', income: 65000, withholding: 0, itemized: 20000 });
  expect(r.taxableIncome).toBe(65000 - 20000);
});

test('credits reduce tax but not below zero balance owed past withholding', () => {
  const r = estimateRefund({ status: 'single', income: 65000, withholding: 6500, credits: 1000 });
  expect(r.tax).toBeCloseTo(5749.5 - 1000, 2);
});
```

- [ ] **Step 2: Run → FAIL.** `npm test src/lib/tax/refund.test.ts`

- [ ] **Step 3: Implement `refund.ts`**

```ts
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
```

- [ ] **Step 4: Run → PASS.** `npm test src/lib/tax/refund.test.ts`

- [ ] **Step 5: Write failing tests — S-corp**

`src/lib/tax/scorp.test.ts`:
```ts
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
```

- [ ] **Step 6: Run → FAIL.** `npm test src/lib/tax/scorp.test.ts`

- [ ] **Step 7: Implement `scorp.ts`**

```ts
import { computeSeTax } from './seTax';
import { FICA } from './constants2025';

export interface ScorpInput {
  netProfit: number;
  reasonableSalary: number;
  /** Annual extra cost of running an S-corp (payroll service + 1120-S prep). Default $2,000. */
  addedCost?: number;
}

export interface ScorpResult {
  llc: { seTax: number };
  scorp: { salary: number; distribution: number; payrollTax: number };
  addedCost: number;
  /** LLC SE tax − S-corp payroll tax − addedCost. Positive = S-corp saves money. */
  netSavings: number;
}

export function compareScorpVsLlc(input: ScorpInput): ScorpResult {
  const profit = Math.max(0, input.netProfit);
  const salary = Math.min(Math.max(0, input.reasonableSalary), profit);
  const addedCost = input.addedCost ?? 2000;

  // LLC / sole-prop: SE tax on the whole profit. (status doesn't affect SS/Medicare portions here)
  const llcSeTax = computeSeTax(profit, 'single').total;

  // S-corp: employer+employee FICA on the W-2 salary only.
  const ss = Math.min(salary, FICA.socialSecurityWageBase) * FICA.socialSecurityRate;
  const medicare = salary * FICA.medicareRate;
  const payrollTax = ss + medicare;
  const distribution = Math.max(0, profit - salary);

  const netSavings = llcSeTax - payrollTax - addedCost;
  return {
    llc: { seTax: llcSeTax },
    scorp: { salary, distribution, payrollTax },
    addedCost,
    netSavings,
  };
}
```

- [ ] **Step 8: Run → PASS.** `npm test src/lib/tax/scorp.test.ts`

- [ ] **Step 9: Create barrel `src/lib/tax/index.ts`**

```ts
export * from './constants2025';
export * from './format';
export * from './brackets';
export * from './seTax';
export * from './refund';
export * from './scorp';
```

- [ ] **Step 10: Run full suite + commit**

Run: `npm test` → Expected: all pass.
```bash
git add src/lib/tax/refund.ts src/lib/tax/refund.test.ts src/lib/tax/scorp.ts src/lib/tax/scorp.test.ts src/lib/tax/index.ts && git commit -m "feat(tax): refund estimator + S-corp/LLC comparison (TDD)"
```

> Note: `src/lib/tax/format.ts` is created in Task 6 (the barrel references it; create Task 6 before running a production build, or temporarily omit the format line until Task 6). To keep this task self-contained, create a minimal `format.ts` stub now if needed and flesh it out in Task 6.

---

## Task 6: Shared UI primitives (format util, disclaimer, BookConsult, config)

**Files:**
- Create: `src/lib/tax/format.ts`
- Create: `src/components/TaxDisclaimer.astro`
- Create: `src/components/BookConsult.astro`
- Modify: `src/config.ts`
- Modify: `src/styles/global.css` (append calculator styles)

- [ ] **Step 1: Create `src/lib/tax/format.ts`**

```ts
export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatPct(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}
```

- [ ] **Step 2: Add booking config to `src/config.ts`**

Append to the `SITE` object (before the closing brace), after `areaServed`:
```ts
  // Phase 1: scheduler not yet connected → CTA routes to the contact page.
  // Phase 2: set to a Calendly/Cal.com/GHL URL to make every CTA real scheduling.
  bookingUrl: '/contact/',
  bookingIsExternal: false,
```

Add a `Tax Tools` nav entry — change the `NAV` array's first entry block to include it right after Services:
```ts
export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Tax Tools', href: '/tax-tools/' },
  { label: 'Locations', href: '/locations/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];
```

- [ ] **Step 3: Create `src/components/BookConsult.astro`**

```astro
---
import { SITE } from '../config';
import { href } from '../lib/seo';
interface Props { label?: string; variant?: 'primary' | 'ghost'; class?: string; }
const { label = 'Book a Free Consultation', variant = 'primary', class: cls = '' } = Astro.props;
const url = SITE.bookingIsExternal ? SITE.bookingUrl : href(SITE.bookingUrl);
const ext = SITE.bookingIsExternal;
const btnClass = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
---
<a
  href={url}
  class={`${btnClass} ${cls}`}
  {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
  data-book-consult
>{label}</a>
```

- [ ] **Step 4: Create `src/components/TaxDisclaimer.astro`**

```astro
---
// Reusable YMYL disclaimer for every calculator/tool.
---
<aside class="tax-disclaimer" role="note">
  <p>
    <strong>Estimates for planning only — not tax advice.</strong>
    Figures use 2025 federal tax law and a simplified model that omits many credits,
    deductions, and state taxes. Your actual liability depends on your full situation.
    For an accurate number,
    <a href="/contact/" data-disclaimer-contact>talk with Wayne Jones, CPA</a>.
  </p>
</aside>
```
> Note: the implementer must route that `/contact/` link through `href()` like the rest of the site. Use:
```astro
---
import { href } from '../lib/seo';
---
... <a href={href('/contact/')} data-disclaimer-contact>talk with Wayne Jones, CPA</a> ...
```

- [ ] **Step 5: Append calculator styles to `src/styles/global.css`**

Append (uses existing tokens; AA-safe gold text; mobile-first):
```css
/* ===== Tax calculators ===== */
.calc { display: grid; grid-template-columns: 1fr; gap: clamp(20px, 3vw, 32px); }
@media (min-width: 880px) { .calc { grid-template-columns: 1.05fr 0.95fr; align-items: start; } }
.calc__fields { display: flex; flex-direction: column; gap: 18px; }
.calc__field { display: flex; flex-direction: column; gap: 6px; }
.calc__field label { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--ink); }
.calc__field input, .calc__field select {
  font-family: var(--font-body); font-size: 1rem; color: var(--ink);
  background: var(--ivory-surface); border: 1px solid rgba(182,146,74,.4);
  padding: 11px 13px; border-radius: 2px;
}
.calc__field input:focus-visible, .calc__field select:focus-visible {
  outline: 2px solid var(--oxblood); outline-offset: 1px;
}
.calc__hint { font-family: var(--font-body); font-weight: 300; font-size: 0.8rem; color: var(--ink-muted); }
.calc__results {
  background: var(--ivory-surface); border: 1px solid rgba(182,146,74,.4);
  box-shadow: var(--shadow-panel); padding: clamp(22px, 3vw, 30px);
}
.calc__result-row { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 12px 0; border-bottom: 1px solid rgba(182,146,74,.18); }
.calc__result-row:last-child { border-bottom: 0; }
.calc__result-label { font-family: var(--font-body); font-weight: 300; color: var(--ink-muted); font-size: 0.92rem; }
.calc__result-value { font-family: var(--font-display); font-weight: 500; color: var(--ink); font-size: 1.05rem; font-variant-numeric: tabular-nums; }
.calc__headline { font-family: var(--font-display); font-weight: 600; color: var(--oxblood); font-size: clamp(1.6rem, 3.4vw, 2.3rem); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.calc__headline-label { font-family: var(--font-body); font-weight: 300; font-size: 0.85rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-text); }
.calc__nojs { font-family: var(--font-body); font-weight: 300; color: var(--ink-muted); font-size: 0.9rem; }
.calc__cta { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 12px; }

/* ===== Tax disclaimer ===== */
.tax-disclaimer { border-left: 3px solid var(--gold); background: var(--ivory-surface); padding: 14px 18px; margin: 28px 0; }
.tax-disclaimer p { font-family: var(--font-body); font-weight: 300; font-size: 0.85rem; line-height: 1.6; color: var(--ink-muted); margin: 0; }
.tax-disclaimer a { color: var(--oxblood); }

/* ===== Trust bar ===== */
.trustbar { background: var(--navy); color: var(--ivory); }
.trustbar__inner { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(14px, 3vw, 40px); padding: 16px 20px; max-width: var(--max-w); margin: 0 auto; }
.trustbar__item { display: flex; align-items: center; gap: 9px; font-family: var(--font-body); font-weight: 400; font-size: 0.82rem; letter-spacing: .03em; color: rgba(247,244,236,.92); }
.trustbar__item svg { flex: 0 0 auto; color: var(--gold); }
.trustbar__sep { color: rgba(182,146,74,.5); }
@media (max-width: 640px) { .trustbar__sep { display: none; } .trustbar__inner { gap: 10px 18px; } }

/* ===== Sticky mobile call bar ===== */
.callbar { display: none; }
@media (max-width: 640px) {
  .callbar {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
    background: var(--navy); border-top: 1px solid var(--gold);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  .callbar a { font-family: var(--font-display); font-weight: 500; font-size: 0.95rem; text-align: center; padding: 14px 8px; text-decoration: none; }
  .callbar__call { color: var(--ivory); }
  .callbar__book { color: var(--navy); background: var(--gold); }
  body { padding-bottom: 56px; }
}
```

- [ ] **Step 6: Build check + commit**

Run: `npm run build`
Expected: clean build (config + components compile).
```bash
git add src/lib/tax/format.ts src/components/TaxDisclaimer.astro src/components/BookConsult.astro src/config.ts src/styles/global.css && git commit -m "feat(ui): tax-format util, disclaimer, BookConsult CTA scaffold, calc/trust styles"
```

---

## Task 7: Tax Tools hub page

**Files:**
- Create: `src/pages/tax-tools/index.astro`

- [ ] **Step 1: Implement the hub** (mirrors the services-hub pattern: `BaseLayout` + `SchemaOrg` + `Breadcrumbs` + `.section-wrap`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import SchemaOrg from '../../components/SchemaOrg.astro';
import CTASection from '../../components/CTASection.astro';
import TaxDisclaimer from '../../components/TaxDisclaimer.astro';
import { href, absoluteUrl } from '../../lib/seo';

const seo = {
  title: 'Free Tax Calculators & Tools | Wayne Jones, CPA — Rome, GA',
  description: 'Free 2025 tax tools from a Rome, GA CPA: federal refund estimator, self-employment & quarterly tax calculator, and an S-corp vs. LLC savings calculator.',
  canonical: '/tax-tools/',
};
const tools = [
  { title: 'Federal Tax Refund Estimator', href: '/tax-tools/tax-refund-estimator/', blurb: 'Estimate your 2025 federal refund or balance due in seconds.' },
  { title: 'Self-Employment Tax Calculator', href: '/tax-tools/self-employment-tax-calculator/', blurb: 'See your SE tax and quarterly estimated payments as a 1099 / small-business owner.' },
  { title: 'S-Corp vs. LLC Savings Calculator', href: '/tax-tools/s-corp-vs-llc-calculator/', blurb: 'See how much an S-corp election could save you over a sole proprietorship.' },
];
const breadcrumbs = [ { label: 'Home', href: '/' }, { label: 'Tax Tools', href: '/tax-tools/' } ];
const itemListSchema = {
  '@context': 'https://schema.org', '@type': 'ItemList',
  name: 'Free Tax Tools — Wayne Jones, CPA',
  itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: absoluteUrl(t.href) })),
};
---
<BaseLayout seo={seo}>
  <SchemaOrg schema={itemListSchema} />
  <Breadcrumbs items={breadcrumbs} />
  <section class="section-wrap section-wrap--prose tax-hub" aria-label="Tax tools">
    <header>
      <p class="eyebrow reveal" data-reveal>Free Tools — 2025 Tax Year</p>
      <h1 class="section-title reveal" data-reveal style="--d:1">Tax Calculators &amp; Tools</h1>
      <p class="section-deck reveal" data-reveal style="--d:2">Quick, free estimates built by a licensed CPA. Run the numbers yourself, then book a free consultation to make them exact.</p>
    </header>
    <ul class="tax-hub__list reveal" data-reveal style="--d:3">
      {tools.map((t) => (
        <li class="tax-hub__card">
          <a href={href(t.href)}><h2>{t.title}</h2><p>{t.blurb}</p><span aria-hidden="true">Open tool &rarr;</span></a>
        </li>
      ))}
    </ul>
    <TaxDisclaimer />
  </section>
  <CTASection />
</BaseLayout>
<style>
  .tax-hub { padding-top: clamp(48px, 6vw, 80px); padding-bottom: clamp(40px, 5vw, 64px); }
  .tax-hub__list { list-style: none; padding: 0; margin: 40px 0 0; display: grid; gap: 16px; }
  .tax-hub__card a { display: block; text-decoration: none; border: 1px solid rgba(182,146,74,.4); background: var(--ivory-surface); box-shadow: var(--shadow-panel); padding: 22px 24px; transition: border-color .25s var(--ease); }
  .tax-hub__card a:hover { border-color: var(--oxblood); }
  .tax-hub__card h2 { font-family: var(--font-display); font-weight: 500; font-size: 1.2rem; color: var(--ink); margin: 0 0 6px; }
  .tax-hub__card p { font-family: var(--font-body); font-weight: 300; font-size: 0.94rem; color: var(--ink-muted); margin: 0 0 10px; }
  .tax-hub__card span { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--oxblood); }
</style>
```

- [ ] **Step 2: Build + verify route**

Run: `npm run build` then `node previews/audit-seo.cjs`
Expected: build clean; `/tax-tools/` in dist; audit 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/tax-tools/index.astro && git commit -m "feat(tax-tools): hub page + nav entry"
```

---

## Task 8: Refund Estimator (component + page)

**Files:**
- Create: `src/components/calculators/RefundEstimator.astro`
- Create: `src/pages/tax-tools/tax-refund-estimator.astro`

**Pattern for all three calculators:** server-render the full form + a results container with `hidden` removed only by JS; a `<noscript>`-style fallback line inside results (visible until JS populates). Client `<script>` imports the pure function, reads inputs by `id`, writes results, recalculates on every `input` event, and uses `aria-live="polite"` on the results region.

- [ ] **Step 1: Implement `RefundEstimator.astro`**

```astro
---
import { href } from '../../lib/seo';
---
<form class="calc" id="refund-calc" aria-label="Federal tax refund estimator" novalidate>
  <div class="calc__fields">
    <div class="calc__field">
      <label for="rf-status">Filing status</label>
      <select id="rf-status">
        <option value="single">Single</option>
        <option value="mfj">Married filing jointly</option>
        <option value="hoh">Head of household</option>
      </select>
    </div>
    <div class="calc__field">
      <label for="rf-income">Total income (wages, etc.)</label>
      <input id="rf-income" type="number" inputmode="numeric" min="0" step="500" value="65000" />
    </div>
    <div class="calc__field">
      <label for="rf-withholding">Federal tax withheld</label>
      <input id="rf-withholding" type="number" inputmode="numeric" min="0" step="100" value="6500" />
      <span class="calc__hint">From your W-2 box 2 / paychecks.</span>
    </div>
    <div class="calc__field">
      <label for="rf-itemized">Itemized deductions (optional)</label>
      <input id="rf-itemized" type="number" inputmode="numeric" min="0" step="500" value="0" />
      <span class="calc__hint">Leave 0 to use the 2025 standard deduction automatically.</span>
    </div>
    <div class="calc__field">
      <label for="rf-credits">Tax credits (optional)</label>
      <input id="rf-credits" type="number" inputmode="numeric" min="0" step="100" value="0" />
    </div>
  </div>
  <div class="calc__results" aria-live="polite">
    <p class="calc__headline-label">Estimated result</p>
    <p class="calc__headline" id="rf-headline">Enable JavaScript to calculate</p>
    <p class="calc__nojs" id="rf-subline">Or call (706) 232-8565 — we'll run it for you.</p>
    <div id="rf-detail" hidden>
      <div class="calc__result-row"><span class="calc__result-label">Taxable income</span><span class="calc__result-value" id="rf-taxable">—</span></div>
      <div class="calc__result-row"><span class="calc__result-label">Estimated federal tax</span><span class="calc__result-value" id="rf-tax">—</span></div>
      <div class="calc__result-row"><span class="calc__result-label">Effective rate</span><span class="calc__result-value" id="rf-eff">—</span></div>
      <div class="calc__result-row"><span class="calc__result-label">Marginal bracket</span><span class="calc__result-value" id="rf-marg">—</span></div>
    </div>
    <div class="calc__cta"><a class="btn-primary" href={href('/contact/')}>Get my exact number</a></div>
  </div>
</form>
<script>
  import { estimateRefund } from '../../lib/tax/refund';
  import { formatUSD, formatPct } from '../../lib/tax/format';
  const $ = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
  const form = document.getElementById('refund-calc');
  if (form) {
    const num = (id: string) => Math.max(0, parseFloat(($(id) as HTMLInputElement).value) || 0);
    const render = () => {
      const r = estimateRefund({
        status: ($('rf-status') as HTMLSelectElement).value as 'single' | 'mfj' | 'hoh',
        income: num('rf-income'), withholding: num('rf-withholding'),
        itemized: num('rf-itemized'), credits: num('rf-credits'),
      });
      const head = document.getElementById('rf-headline')!;
      const sub = document.getElementById('rf-subline')!;
      const detail = document.getElementById('rf-detail')!;
      if (r.balance >= 0) { head.textContent = `${formatUSD(r.balance)} refund`; sub.textContent = 'Estimated federal refund.'; }
      else { head.textContent = `${formatUSD(Math.abs(r.balance))} owed`; sub.textContent = 'Estimated balance due.'; }
      document.getElementById('rf-taxable')!.textContent = formatUSD(r.taxableIncome);
      document.getElementById('rf-tax')!.textContent = formatUSD(r.tax);
      document.getElementById('rf-eff')!.textContent = formatPct(r.effectiveRate);
      document.getElementById('rf-marg')!.textContent = formatPct(r.marginalRate);
      detail.hidden = false;
    };
    form.addEventListener('input', render);
    render();
  }
</script>
```

- [ ] **Step 2: Implement the page `src/pages/tax-tools/tax-refund-estimator.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import SchemaOrg from '../../components/SchemaOrg.astro';
import CTASection from '../../components/CTASection.astro';
import TaxDisclaimer from '../../components/TaxDisclaimer.astro';
import RefundEstimator from '../../components/calculators/RefundEstimator.astro';
import { href, absoluteUrl } from '../../lib/seo';

const seo = {
  title: '2025 Tax Refund Estimator | Wayne Jones, CPA — Rome, GA',
  description: 'Free 2025 federal tax refund estimator from a Rome, GA CPA. Estimate your refund or balance due by filing status, income, and withholding.',
  canonical: '/tax-tools/tax-refund-estimator/',
};
const breadcrumbs = [ { label: 'Home', href: '/' }, { label: 'Tax Tools', href: '/tax-tools/' }, { label: 'Refund Estimator', href: '/tax-tools/tax-refund-estimator/' } ];
const faq = [
  { q: 'How accurate is this refund estimate?', a: 'It applies 2025 federal brackets and the standard (or your itemized) deduction. It does not include every credit, state tax, or special situation, so treat it as a planning ballpark and confirm with a CPA.' },
  { q: 'What standard deduction does it use?', a: 'The 2025 standard deduction: $15,750 single, $31,500 married filing jointly, $23,625 head of household. If you enter a larger itemized amount, it uses that instead.' },
  { q: 'Does it handle self-employment income?', a: 'For 1099 / self-employment income, use our Self-Employment Tax Calculator, which adds SE tax and quarterly estimates.' },
];
const appSchema = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: '2025 Federal Tax Refund Estimator', applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web', url: absoluteUrl('/tax-tools/tax-refund-estimator/'),
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  provider: { '@type': 'AccountingService', '@id': absoluteUrl('/') + '#business' },
};
const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
---
<BaseLayout seo={seo}>
  <SchemaOrg schema={appSchema} />
  <SchemaOrg schema={faqSchema} />
  <Breadcrumbs items={breadcrumbs} />
  <section class="section-wrap section-wrap--prose calc-page" aria-label="Refund estimator">
    <header>
      <p class="eyebrow reveal" data-reveal>2025 Tax Year</p>
      <h1 class="section-title reveal" data-reveal style="--d:1">Federal Tax Refund Estimator</h1>
      <p class="section-deck reveal" data-reveal style="--d:2">Estimate your 2025 federal refund or balance due. Adjust the numbers and watch the result update.</p>
    </header>
    <RefundEstimator />
    <TaxDisclaimer />
    <div class="calc-page__faq">
      <h2 class="section-subtitle">Frequently asked questions</h2>
      {faq.map((f) => (<div class="calc-page__faq-item"><h3>{f.q}</h3><p>{f.a}</p></div>))}
    </div>
    <p class="calc-page__related"><a href={href('/services/individual-tax-returns/')}>Need it done right? See individual tax return services &rarr;</a></p>
  </section>
  <CTASection />
</BaseLayout>
<style>
  .calc-page { padding-top: clamp(48px, 6vw, 80px); padding-bottom: clamp(40px, 5vw, 64px); }
  .calc-page header { margin-bottom: clamp(28px, 4vw, 44px); }
  .calc-page__faq { margin-top: clamp(40px, 5vw, 56px); }
  .calc-page__faq-item { padding: 14px 0; border-bottom: 1px solid rgba(182,146,74,.18); }
  .calc-page__faq-item h3 { font-family: var(--font-display); font-weight: 500; font-size: 1rem; color: var(--ink); margin: 0 0 6px; }
  .calc-page__faq-item p { font-family: var(--font-body); font-weight: 300; font-size: 0.92rem; line-height: 1.6; color: var(--ink-muted); margin: 0; }
  .calc-page__related { margin-top: 28px; }
  .calc-page__related a { font-family: var(--font-display); font-weight: 500; color: var(--oxblood); }
  .section-subtitle { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.3rem,2.1vw,1.7rem); color: var(--ink); margin: 0 0 14px; }
</style>
```

- [ ] **Step 3: Build + visual + commit**

Run: `npm run build` (clean), `node previews/page-shoot.cjs tax-tools/tax-refund-estimator refund-tool 1200` then view the screenshot; check the form renders, results update is wired, AA contrast.
```bash
git add src/components/calculators/RefundEstimator.astro src/pages/tax-tools/tax-refund-estimator.astro && git commit -m "feat(tax-tools): refund estimator calculator + page"
```

---

## Task 9: Self-Employment & Quarterly Tax Calculator (component + page)

**Files:**
- Create: `src/components/calculators/SelfEmploymentCalculator.astro`
- Create: `src/pages/tax-tools/self-employment-tax-calculator.astro`

- [ ] **Step 1: Implement `SelfEmploymentCalculator.astro`**

Fields: `se-status` (select single/mfj/hoh), `se-profit` (number, default 80000), `se-other` (other household taxable income, default 0). Results region ids: `se-headline` (total estimated tax), `se-quarter`, `se-setax`, `se-inctax`, `se-detail`. CTA → `href('/contact/')`. Use the same markup shape as Task 8 Step 1 (`.calc`, `.calc__fields`, `.calc__results`, `aria-live`, no-JS fallback line).

Client `<script>`:
```ts
import { computeSeTax } from '../../lib/tax/seTax';
import { computeIncomeTax } from '../../lib/tax/brackets';
import { STANDARD_DEDUCTION_2025 } from '../../lib/tax/constants2025';
import { formatUSD } from '../../lib/tax/format';
const form = document.getElementById('se-calc');
if (form) {
  const val = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
  const num = (id: string) => Math.max(0, parseFloat(val(id)) || 0);
  const render = () => {
    const status = val('se-status') as 'single' | 'mfj' | 'hoh';
    const profit = num('se-profit');
    const other = num('se-other');
    const se = computeSeTax(profit, status);
    const taxable = Math.max(0, profit - se.halfDeduction + other - STANDARD_DEDUCTION_2025[status]);
    const incomeTax = computeIncomeTax(taxable, status);
    const total = se.total + incomeTax;
    document.getElementById('se-headline')!.textContent = `${formatUSD(total)} total est. tax`;
    document.getElementById('se-quarter')!.textContent = formatUSD(total / 4);
    document.getElementById('se-setax')!.textContent = formatUSD(se.total);
    document.getElementById('se-inctax')!.textContent = formatUSD(incomeTax);
    (document.getElementById('se-detail') as HTMLElement).hidden = false;
  };
  form.addEventListener('input', render);
  render();
}
```
Include a static list of the **2026 quarterly due dates** in the page body: Apr 15, 2026 · Jun 15, 2026 · Sep 15, 2026 · Jan 15, 2027.

- [ ] **Step 2: Implement the page `self-employment-tax-calculator.astro`**

Same structure as Task 8 Step 2 with:
- `seo.title`: `'2025 Self-Employment Tax Calculator | Wayne Jones, CPA'`
- `seo.description`: `'Free 2025 self-employment & quarterly estimated tax calculator from a Rome, GA CPA. Estimate SE tax and your quarterly payments for 1099 and small-business income.'`
- `canonical`: `/tax-tools/self-employment-tax-calculator/`
- breadcrumbs third crumb label `'Self-Employment Tax'`
- `WebApplication` schema name `'2025 Self-Employment Tax Calculator'`, same shape as Task 8 (offers price 0, provider #business)
- 3 FAQs: (1) "How is self-employment tax calculated?" → 15.3% on 92.35% of net profit (12.4% SS up to $176,100, 2.9% Medicare). (2) "When are quarterly taxes due?" → the four 2026 dates. (3) "Can I lower my SE tax?" → mention S-corp election + link to the S-corp calculator.
- related link → `href('/services/tax-preparation/')` and `href('/tax-tools/s-corp-vs-llc-calculator/')`.

- [ ] **Step 3: Build + visual + commit**

Run: `npm run build`; `node previews/page-shoot.cjs tax-tools/self-employment-tax-calculator se-tool 1200`; view.
```bash
git add src/components/calculators/SelfEmploymentCalculator.astro src/pages/tax-tools/self-employment-tax-calculator.astro && git commit -m "feat(tax-tools): self-employment + quarterly tax calculator + page"
```

---

## Task 10: S-Corp vs. LLC Savings Calculator (component + page)

**Files:**
- Create: `src/components/calculators/ScorpCalculator.astro`
- Create: `src/pages/tax-tools/s-corp-vs-llc-calculator.astro`

- [ ] **Step 1: Implement `ScorpCalculator.astro`**

Fields: `sc-profit` (number, default 120000), `sc-salary` (number, default 60000, hint: "A reasonable W-2 salary you'd pay yourself"), `sc-cost` (number, default 2000, hint: "Annual payroll + S-corp tax-prep cost"). Results: `sc-headline` (net savings, big), `sc-llc` (sole-prop SE tax), `sc-scorp` (S-corp payroll tax), `sc-dist` (tax-free distribution), `sc-detail`. CTA → `href('/contact/')` with copy emphasizing reasonable-comp risk.

Client `<script>`:
```ts
import { compareScorpVsLlc } from '../../lib/tax/scorp';
import { formatUSD } from '../../lib/tax/format';
const form = document.getElementById('scorp-calc');
if (form) {
  const num = (id: string) => Math.max(0, parseFloat((document.getElementById(id) as HTMLInputElement).value) || 0);
  const render = () => {
    const r = compareScorpVsLlc({ netProfit: num('sc-profit'), reasonableSalary: num('sc-salary'), addedCost: num('sc-cost') });
    const head = document.getElementById('sc-headline')!;
    head.textContent = r.netSavings > 0 ? `${formatUSD(r.netSavings)}/yr potential savings` : `No net savings at these numbers`;
    document.getElementById('sc-llc')!.textContent = formatUSD(r.llc.seTax);
    document.getElementById('sc-scorp')!.textContent = formatUSD(r.scorp.payrollTax);
    document.getElementById('sc-dist')!.textContent = formatUSD(r.scorp.distribution);
    (document.getElementById('sc-detail') as HTMLElement).hidden = false;
  };
  form.addEventListener('input', render);
  render();
}
```

- [ ] **Step 2: Implement the page `s-corp-vs-llc-calculator.astro`**

Same structure with:
- `seo.title`: `'S-Corp vs. LLC Tax Savings Calculator | Wayne Jones, CPA'`
- `seo.description`: `'Free S-corp vs. LLC tax calculator from a Rome, GA CPA. See how much an S-corp election could save you in self-employment tax — and what a reasonable salary means.'`
- `canonical`: `/tax-tools/s-corp-vs-llc-calculator/`
- breadcrumb label `'S-Corp vs. LLC'`
- `WebApplication` schema name `'S-Corp vs. LLC Tax Savings Calculator'`
- 3 FAQs: (1) "How does an S-corp save taxes?" → salary vs distribution / SE tax. (2) "What is a reasonable salary?" → IRS requires reasonable comp; audit risk; CPA sets it. (3) "Is an S-corp always worth it?" → added cost/admin; breakeven; consult.
- A prominent callout near the CTA: "Reasonable salary is an IRS audit flashpoint — book a consult so Wayne sets a defensible number." (link via `href('/contact/')`).
- related → `href('/services/business-consulting/')`, `href('/tax-tools/self-employment-tax-calculator/')`.

- [ ] **Step 3: Build + visual + commit**

Run: `npm run build`; `node previews/page-shoot.cjs tax-tools/s-corp-vs-llc-calculator scorp-tool 1200`; view.
```bash
git add src/components/calculators/ScorpCalculator.astro src/pages/tax-tools/s-corp-vs-llc-calculator.astro && git commit -m "feat(tax-tools): S-corp vs LLC savings calculator + page"
```

> **Tasks 8, 9, 10 are independent** (separate component + page files, shared read-only `src/lib/tax`). They may be built by parallel agents; only `git commit` is serialized.

---

## Task 11: Conversion — sticky call bar + hero CTA tighten

**Files:**
- Create: `src/components/StickyCallBar.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Create `StickyCallBar.astro`** (mobile-only; styles already in global.css Task 6)

```astro
---
import { SITE } from '../config';
import { href } from '../lib/seo';
const bookUrl = SITE.bookingIsExternal ? SITE.bookingUrl : href(SITE.bookingUrl);
---
<nav class="callbar" aria-label="Quick contact">
  <a class="callbar__call" href={SITE.phoneHref}>Call {SITE.phone}</a>
  <a class="callbar__book" href={bookUrl} {...(SITE.bookingIsExternal ? { target: '_blank', rel: 'noopener' } : {})}>Book</a>
</nav>
```

- [ ] **Step 2: Render it in `BaseLayout.astro`**

Import at top: `import StickyCallBar from '../components/StickyCallBar.astro';`. Render `<StickyCallBar />` immediately before the closing `</body>` (after `<Footer />`). Verify by reading the layout first to place it correctly.

- [ ] **Step 3: Tighten the Hero CTAs in `Hero.astro`**

Replace the `hero__ctas` block (lines ~27–30) with a `BookConsult` primary + the call as secondary:
```astro
---
import { href } from '../../lib/seo';
import BookConsult from '../BookConsult.astro';
import { SITE } from '../../config';
---
...
        <div class="hero__ctas reveal" data-reveal style="--d:5">
          <BookConsult variant="primary" />
          <a href={SITE.phoneHref} class="btn-ghost">{SITE.phone}</a>
        </div>
```
(Keep everything else in the hero unchanged.)

- [ ] **Step 4: Build + mobile visual + commit**

Run: `npm run build`; `node previews/fold-shoot.cjs "" hero-cta 1100`; and a mobile shot: `node previews/page-shoot.cjs "" home-mobile 390` (or the existing mobile render script) to confirm the sticky bar shows on mobile and not desktop.
```bash
git add src/components/StickyCallBar.astro src/layouts/BaseLayout.astro src/components/sections/Hero.astro && git commit -m "feat(conversion): sticky mobile call bar + unified Book a Free Consultation hero CTA"
```

---

## Task 12: Trust bar (homepage)

**Files:**
- Create: `src/components/TrustBar.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `TrustBar.astro`** (styles in global.css Task 6)

```astro
---
const items = [
  { label: 'Licensed CPA — GA #026715' },
  { label: 'Licensed in Georgia & Alabama' },
  { label: '35+ Years in Practice' },
  { label: 'IRS e-File Authorized' },
];
const check = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
---
<section class="trustbar" aria-label="Credentials">
  <div class="trustbar__inner">
    {items.map((it, i) => (
      <>
        {i > 0 && <span class="trustbar__sep" aria-hidden="true">·</span>}
        <span class="trustbar__item"><Fragment set:html={check} />{it.label}</span>
      </>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Render on the homepage** in `src/pages/index.astro`

Read `index.astro` first. Import `TrustBar` and place `<TrustBar />` immediately after the `<Hero />` component (before the next section). Import: `import TrustBar from '../components/TrustBar.astro';`.

- [ ] **Step 3: Build + visual + commit**

Run: `npm run build`; `node previews/fold-shoot.cjs "" trustbar 1100`; view (trust bar sits directly under hero, navy band, gold checks, AA contrast).
```bash
git add src/components/TrustBar.astro src/pages/index.astro && git commit -m "feat(trust): credentials trust bar under the hero"
```

---

## Task 13: Resources hub + 2 branded PDFs

**Files:**
- Create: `previews/assets/pdf-deadlines.html`, `previews/assets/pdf-checklist.html`
- Create: `previews/gen-pdfs.cjs`
- Create: `public/resources/2026-tax-deadline-calendar.pdf`, `public/resources/small-business-tax-prep-checklist.pdf`
- Create: `src/pages/resources/index.astro`

- [ ] **Step 1: Author the two PDF source HTML templates** (engraved style: ivory bg, navy headings, gold rules, Fraunces/Spectral via Google Fonts link). `pdf-deadlines.html` = a 2026 federal tax deadline calendar (individual filing Apr 15; quarterly estimates Apr 15 / Jun 15 / Sep 15 2026 + Jan 15 2027; S-corp/partnership Mar 16 2026; C-corp Apr 15; extension dates Oct 15). `pdf-checklist.html` = small-business tax-prep checklist grouped by entity (sole-prop/LLC, S-corp, what to bring: income docs, expense categories, mileage, payroll, 1099s, prior return). Letter size, print CSS `@page { size: letter; margin: 0.6in; }`. Include footer: "Wayne Jones, CPA · (706) 232-8565 · Rome, GA · Estimates/general info, not tax advice."

- [ ] **Step 2: Write `previews/gen-pdfs.cjs`** (Playwright → PDF)

```js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [
    ['pdf-deadlines.html', '2026-tax-deadline-calendar.pdf'],
    ['pdf-checklist.html', 'small-business-tax-prep-checklist.pdf'],
  ];
  for (const [src, out] of jobs) {
    await page.goto('file://' + path.resolve(__dirname, 'assets', src), { waitUntil: 'networkidle' });
    await page.pdf({ path: path.resolve(__dirname, '../public/resources', out), format: 'Letter', printBackground: true });
    console.log('wrote', out);
  }
  await browser.close();
})();
```
Run: `mkdir -p public/resources && node previews/gen-pdfs.cjs`
Expected: two PDFs written, each > 10 KB. Open one to eyeball.

- [ ] **Step 3: Implement `src/pages/resources/index.astro`**

`BaseLayout` + `Breadcrumbs` + `SchemaOrg` (ItemList of the 2 downloads) + `CTASection`. Each resource = a card linking to `href('/resources/<file>.pdf')` with `download` attribute, title, description, and "Download PDF →". `seo.title` = `'Free Tax Resources & Checklists | Wayne Jones, CPA — Rome, GA'`; canonical `/resources/`. Add `{ label: 'Resources', href: '/resources/' }` is NOT added to top nav (keep nav lean); instead link Resources from the footer — see Step 4.

- [ ] **Step 4: Link Resources from the footer**

Read `src/components/Footer.astro`; add a `/resources/` link (via `href()`) in the existing footer link list, matching the established markup.

- [ ] **Step 5: Build + audit + commit**

Run: `npm run build`; `node previews/audit-seo.cjs` (0 errors); confirm `/resources/` + both PDFs in `dist`.
```bash
git add previews/assets/pdf-deadlines.html previews/assets/pdf-checklist.html previews/gen-pdfs.cjs public/resources src/pages/resources/index.astro src/components/Footer.astro && git commit -m "feat(resources): lead-magnet PDFs (deadline calendar + checklist) + resources hub"
```

---

## Task 14: Full QA — build, tests, schema/SEO/centering, a11y, visual

**Files:**
- Modify (if needed): `previews/audit-seo.cjs`, `previews/validate-schema.cjs`

- [ ] **Step 1: Full unit suite**

Run: `npm test`
Expected: all tax-math tests pass.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: clean; page count increased by 5 (`/tax-tools/` + 3 calculators + `/resources/`); all in `sitemap-index.xml`.

- [ ] **Step 3: SEO + schema audits** (extend if they hardcode a route list)

Run: `node previews/audit-seo.cjs` and `node previews/validate-schema.cjs`
Expected: 0 errors / 0 warnings each. Confirm the new `WebApplication`/`FAQPage`/`ItemList` JSON-LD parse. **Confirm 0 base-less internal links** (the new pages route every link through `href()`).

- [ ] **Step 4: Centering check**

Run: `node previews/check-centering.cjs` (extend its route list to include the 4 tax-tools routes + `/resources/` if it enumerates routes).
Expected: tool pages use `.section-wrap--prose` and are centered.

- [ ] **Step 5: Visual + a11y spot-check (desktop + mobile + no-JS)**

Render each new page desktop and mobile via `previews/page-shoot.cjs`; verify: forms labeled, results update live, AA contrast (gold text uses `--gold-text`), sticky call bar mobile-only, trust bar under hero. For no-JS: confirm the calculators show the "Enable JavaScript / call us" fallback and all copy + disclaimer is server-rendered.

- [ ] **Step 6: Commit any audit-script changes**

```bash
git add previews/*.cjs && git commit -m "test(seo): extend audits to cover tax-tools + resources routes" || echo "no audit changes needed"
```

---

## Self-Review (controller, before finishing)

- **Spec coverage:** A (hub + 3 calculators + pure tested module + disclaimer + schema) = Tasks 2–10; B (BookConsult/BOOKING_URL + sticky call bar + resources/PDFs) = Tasks 6, 11, 13; C (trust bar + hero) = Tasks 11–12. All spec sections map to tasks. ✓
- **No-JS degradation:** every calculator server-renders form + fallback line (Tasks 8–10). ✓
- **Correctness:** all four math modules are TDD'd against the spec's worked examples (Tasks 3–5); constants guarded (Task 2). ✓
- **Type consistency:** `FilingStatus = 'single'|'mfj'|'hoh'`, `computeIncomeTax`, `computeSeTax`, `estimateRefund`, `compareScorpVsLlc`, `formatUSD/formatPct`, `SITE.bookingUrl/bookingIsExternal` — used identically across tasks. ✓
- **DRY:** shared `.calc*` styles + `TaxDisclaimer` + `BookConsult` reused by all tools. ✓

## Execution
Build with **superpowers:subagent-driven-development**. Tasks 1–7 sequential (foundation). Tasks 8–10 independent (parallelizable). Tasks 11–13 independent of each other. Task 14 last. Ship via PR → merge → Pages deploy → live-verify (existing flow).
