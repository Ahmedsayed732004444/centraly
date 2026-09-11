// 'ar-EG-u-nu-latn' keeps the Arabic month/currency wording but forces Latin (0-9)
// digits - the app standardized on Latin digits everywhere (invoice numbers, phone
// numbers) so money/date digits shouldn't switch to Arabic-Indic mid-app.
const CURRENCY_LOCALE = 'ar-EG-u-nu-latn';

export function formatCurrency(value: number): string {
  if (value == null || isNaN(value)) {
    return '0.00 ج.م.';
  }

  if (value === 0) {
    // Specifically format 0 as 0.00
    const zeroFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return zeroFormatter.format(0);
  }

  // Use Intl.NumberFormat to get comma separators (e.g. 155,000)
  const formatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
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

/** Thousands-separated number, no currency suffix - for places that render their own "ج.م" label (compact badges, table cells). Same Latin-digit rule as formatCurrency. */
export function formatNumber(value: number): string {
  if (value == null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}
