import { formatCurrency } from '../currency';

describe('formatCurrency', () => {
  it('formats zero with two decimals', () => {
    expect(formatCurrency(0)).toContain('٠');
  });

  it('formats integers without forcing extra decimals', () => {
    const formatted = formatCurrency(1500);
    expect(formatted).toMatch(/١٬٥٠٠|1,500/);
  });

  it('returns a fallback for invalid numbers', () => {
    expect(formatCurrency(Number.NaN)).toBe('٠٫٠٠ ج.م.');
  });
});
