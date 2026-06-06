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
