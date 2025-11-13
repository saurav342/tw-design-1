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

export const formatDateTimeIST = (value) => {
  if (!value) return 'Not updated yet';
  const safeDate = typeof value === 'string' || value instanceof Date ? new Date(value) : null;
  if (!safeDate || Number.isNaN(safeDate.getTime())) return 'Not updated yet';
  
  // Format date and time in IST (Asia/Kolkata timezone)
  const dateStr = safeDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  
  const timeStr = safeDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
  
  return `${dateStr}, ${timeStr}`;
};
