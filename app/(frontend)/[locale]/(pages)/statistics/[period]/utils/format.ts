export const formatNumber = (value: number, locale?: string): string => {
  if (value >= 0 && value < 10) {
    return value.toString().padStart(2, '0');
  }

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};
