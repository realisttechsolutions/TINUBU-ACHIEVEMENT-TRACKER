import { describe, it, expect } from 'vitest';
import { formatPublicMoney, formatNaira } from '@/utils/formatters';

describe('PTAT Public Currency Formatter (Naira Standard)', () => {
  it('formats values in Nigerian Naira (₦) with standard word denominations', () => {
    expect(formatPublicMoney(1200000000)).toBe('₦1.2 billion');
    expect(formatPublicMoney(850000000)).toBe('₦850 million');
    expect(formatPublicMoney(25400000000000)).toBe('₦25.4 trillion');
    expect(formatPublicMoney(350000)).toBe('₦350 thousand');
  });

  it('formats compact values correctly with ₦ symbol', () => {
    expect(formatPublicMoney(1200000000, { fullWord: false, compact: true })).toBe('₦1.2B');
    expect(formatPublicMoney(850000000, { fullWord: false, compact: true })).toBe('₦850M');
    expect(formatPublicMoney(25400000000000, { fullWord: false, compact: true })).toBe('₦25.4T');
  });

  it('formats string amounts without throwing errors or corrupting digits', () => {
    expect(formatPublicMoney('1500000000')).toBe('₦1.5 billion');
    expect(formatPublicMoney('50000000')).toBe('₦50 million');
  });

  it('handles zero and negative amounts defensively', () => {
    expect(formatPublicMoney(0)).toBe('₦0');
    expect(formatPublicMoney(-5000000000)).toBe('-₦5 billion');
  });
});
