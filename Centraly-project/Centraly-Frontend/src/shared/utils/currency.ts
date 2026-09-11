export function formatCurrency(value: number): string {
  if (value == null || isNaN(value)) {
    return '٠٫٠٠ ج.م.';
  }

  if (value === 0) {
    // Specifically format 0 as 0.00
    const zeroFormatter = new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return zeroFormatter.format(0);
  }

  // Use Intl.NumberFormat to get comma separators (e.g. 155,000)
  const formatter = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
