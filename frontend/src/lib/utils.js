import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const toNumberOrNull = (value) => {
  const parsed = Number(String(value ?? '').replace(/,/g, '').trim());
  if (Number.isNaN(parsed)) return null;
  return parsed;
};
