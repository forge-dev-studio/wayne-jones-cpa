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
