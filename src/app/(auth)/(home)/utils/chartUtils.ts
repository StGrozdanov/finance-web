export const formatNumber = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export const formatCurrencyFixed = (n: number, digits: number): string => {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
};
