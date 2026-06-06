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
