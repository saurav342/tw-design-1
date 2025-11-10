export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
};

export const formatPercentage = (value, precision = 0) => `${value.toFixed(precision)}%`;

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const formatCurrencyInr = (value) => {
  if (value === null || value === undefined) return '—';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
};

export const formatDateDisplay = (value) => {
  if (!value) return 'Not updated yet';
  const safeDate = typeof value === 'string' || value instanceof Date ? new Date(value) : null;
  if (!safeDate || Number.isNaN(safeDate.getTime())) return 'Not updated yet';
  return safeDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
