/**
 * Shared formatting utilities for the finance application
 */

/**
 * Formats a number as currency using USD locale
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a currency amount with a fixed number of decimal places
 * Provides more control over decimal places than formatCurrency
 */
export const formatCurrencyFixed = (amount: number, digits: number): string => {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  return `${sign}$${abs.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
};

/**
 * Formats a change amount with proper +/- prefix
 * Shows + for positive amounts, - for negative amounts
 */
export const formatChange = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};

/**
 * Formats a percentage with proper +/- prefix
 * Shows + for positive percentages, - for negative percentages
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

/**
 * Formats a number with appropriate decimal places based on magnitude
 * Used for price display with different precision for different price ranges
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } else if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(price);
  }
};

/**
 * Formats a quantity with flexible decimal places (2-8)
 * Used for displaying asset quantities, especially cryptocurrencies
 */
export const formatQuantity = (quantity: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(quantity);
};

/**
 * Formats a number with no decimal places (for large numbers)
 */
export const formatNumber = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 0 });
