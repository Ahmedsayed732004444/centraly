import { formatCurrency } from '../currency';

describe('formatCurrency', () => {
  it('formats zero with two decimals', () => {
    expect(formatCurrency(0)).toContain('0.00');
  });

  it('formats integers without forcing extra decimals', () => {
    const formatted = formatCurrency(1500);
    expect(formatted).toContain('1,500');
  });

  it('uses Latin digits, never Arabic-Indic', () => {
    expect(formatCurrency(1500.5)).not.toMatch(/[٠-٩]/);
    expect(formatCurrency(0)).not.toMatch(/[٠-٩]/);
  });

  it('returns a fallback for invalid numbers', () => {
    expect(formatCurrency(Number.NaN)).toBe('0.00 ج.م.');
  });
});
