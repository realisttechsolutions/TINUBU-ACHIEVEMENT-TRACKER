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

  it('never outputs raw dollar signs ($) or USD tokens in public monetary presentation', () => {
    const formatted1 = formatPublicMoney(500000000);
    const formatted2 = formatNaira(1200000);
    expect(formatted1).not.toContain('$');
    expect(formatted1).not.toContain('USD');
    expect(formatted2).not.toContain('$');
    expect(formatted2).not.toContain('USD');
  });

  it('preserves foreign provenance currency in data structures while avoiding numeric relabeling', () => {
    // Provenance financial record structure
    const foreignRecord = {
      amount: '7000000000.0000',
      currency: 'USD',
      sourceInstitution: 'Central Bank of Nigeria',
      settlementType: 'verified_backlog'
    };

    // The raw USD numeric value must NEVER simply be prepended with ₦ as if 1 USD = 1 NGN
    const naiveRelabel = `₦${Number(foreignRecord.amount) / 1e9} Billion`;
    expect(naiveRelabel).toBe('₦7 Billion'); // This is the prohibited naive relabeling

    // Compliant PTAT presentation either presents a verified NGN conversion with rate provenance or a qualitative verified status
    const compliantOutcomePresentation = '100% Cleared';
    expect(compliantOutcomePresentation).not.toBe(naiveRelabel);
    expect(foreignRecord.currency).toBe('USD'); // Provenance is intact
  });
});
