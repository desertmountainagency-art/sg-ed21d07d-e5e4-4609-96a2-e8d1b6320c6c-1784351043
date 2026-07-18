import { CURRENCIES } from './constants';

/**
 * Convert an amount from one currency to another using deterministic rates.
 */
export function convertToTarget(
  amount: number,
  fromCur: string,
  toCur: string,
  rates: Record<string, number>
): number {
  const fromRate = rates[fromCur] || 1;
  const toRate = rates[toCur] || 1;
  // Convert from source currency to USD, then from USD to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

/**
 * Format currency with appropriate symbols.
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const cur = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES.find(c => c.code === 'USD');
  const symbol = cur ? cur.symbol : '$';
  const isNegative = amount < 0;
  return (isNegative ? '-' : '') + symbol + Math.abs(amount).toFixed(2);
}

/**
 * Get timezone-neutral local YYYY-MM-DD date string.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a timezone-neutral YYYY-MM-DD date string for user display.
 */
export function formatLocalDateString(dateStr: string): string {
  // Creating a Date object with a local time string to prevent UTC offsets shifting days
  const dateObj = new Date(`${dateStr}T00:00:00`);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
