export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatPct(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}

export function roundDisplay(n: number): string {
  return formatUSD(Math.round(n / 100) * 100);
}
