import { describe, it, expect } from 'vitest';
import { formatPublicMoney, formatNaira, formatCurrency } from '@/utils/formatters';
import { DEMO_ACHIEVEMENTS } from '@/adapters/canonicalData';
import { sectorsData } from '@/data/sectors/sectors.data';
import { achievementsData } from '@/data/achievements/achievements.data';

describe('PTAT Public Currency Formatter & Presentation Audit (M10J-D2A / M10J-D2B)', () => {
  describe('1. NGN public amount renders ₦ symbol correctly', () => {
    it('formats numbers to Nigerian Naira (₦) with standard full-word denominations', () => {
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

    it('formats numeric strings without corruption and prepends ₦', () => {
      expect(formatPublicMoney('1500000000')).toBe('₦1.5 billion');
      expect(formatPublicMoney('50000000')).toBe('₦50 million');
    });

    it('handles zero and negative amounts defensively with ₦ symbol', () => {
      expect(formatPublicMoney(0)).toBe('₦0');
      expect(formatPublicMoney(-5000000000)).toBe('-₦5 billion');
    });
  });

  describe('2. Public components and formatters do not expose raw $ where NGN is available', () => {
    it('ensures formatPublicMoney and formatNaira never output $ or USD tokens', () => {
      const sampleAmounts = [0, 50000, 1500000, 500000000, 1060000000000];
      sampleAmounts.forEach(amt => {
        const publicFormatted = formatPublicMoney(amt);
        const nairaFormatted = formatNaira(amt);
        expect(publicFormatted).toContain('₦');
        expect(publicFormatted).not.toContain('$');
        expect(publicFormatted).not.toContain('USD');
        expect(publicFormatted).not.toContain('US$');
        expect(nairaFormatted).toContain('₦');
        expect(nairaFormatted).not.toContain('$');
        expect(nairaFormatted).not.toContain('USD');
      });
    });

    it('ensures canonical public achievements dataset contains zero dollar signs in formatted amounts', () => {
      DEMO_ACHIEVEMENTS.forEach(achievement => {
        if (achievement.financialMetrics) {
          achievement.financialMetrics.forEach(fm => {
            expect(fm.formattedAmount).not.toContain('$');
            expect(fm.formattedAmount).not.toContain('USD');
            expect(fm.formattedAmount).not.toContain('US$');
          });
        }
      });
    });
  });

  describe('3. Prohibition of naive numeric relabeling (USD to NGN)', () => {
    it('prohibits relabeling raw USD numbers directly with ₦ (e.g. $7B != ₦7B)', () => {
      const foreignRecord = {
        amount: '7000000000.0000',
        currency: 'USD',
        financialTypeLabel: 'Cleared Backlog'
      };

      // Raw conversion without exchange rate calculation is strictly forbidden
      const prohibitedRelabel = `₦${Number(foreignRecord.amount) / 1e9} Billion`;
      expect(prohibitedRelabel).toBe('₦7 Billion');

      // The canonical dataset must NOT use the naive relabeled amount
      const fxRecord = DEMO_ACHIEVEMENTS.find(a => a.slug === 'fx-market-unification-single-window' || a.id === 'ACH-DEMO-003');
      expect(fxRecord).toBeDefined();
      const fxFinancial = fxRecord?.financialMetrics?.[0];
      expect(fxFinancial?.formattedAmount).not.toBe('₦7.00 Billion');
      expect(fxFinancial?.formattedAmount).not.toBe('₦7 Billion');
      expect(fxFinancial?.formattedAmount).toBe('100% Cleared');
    });
  });

  describe('4. Preservation of original source currency in provenance data', () => {
    it('preserves foreign source currency in canonical financial records', () => {
      const fxRecord = DEMO_ACHIEVEMENTS.find(a => a.slug === 'fx-market-unification-single-window' || a.id === 'ACH-DEMO-003');
      expect(fxRecord).toBeDefined();
      const fxFinancial = fxRecord?.financialMetrics?.[0];
      expect(fxFinancial?.currency).toBe('USD');
      expect(fxFinancial?.amount).toBe('7000000000.0000');
      expect(fxFinancial?.sourceInstitution).toBe('Central Bank of Nigeria');
    });
  });

  describe('5. No unsafe or fabricated currency conversion', () => {
    it('withholds arbitrary numeric conversions when conversion rate provenance is absent', () => {
      const fxRecord = DEMO_ACHIEVEMENTS.find(a => a.slug === 'fx-market-unification-single-window' || a.id === 'ACH-DEMO-003');
      const fxFinancial = fxRecord?.financialMetrics?.[0];

      // Instead of an unverified conversion (e.g. ₦10.5T or ₦7T), a verified qualitative outcome is presented
      expect(fxFinancial?.formattedAmount).toBe('100% Cleared');
      expect(fxFinancial?.formattedAmount).not.toMatch(/₦\s*\d+/);
    });
  });

  describe('6. M10J-D2B Absolute Public USD & Foreign Currency Label Elimination', () => {
    it('ensures public narrative descriptions in sectors and achievements contain zero dollar references', () => {
      sectorsData.forEach(sector => {
        sector.keyPolicies.forEach(kp => {
          expect(kp.impactSummary).not.toMatch(/\bdollars?\b/i);
          expect(kp.impactSummary).not.toMatch(/\bUSD\b/);
          expect(kp.impactSummary).not.toContain('$');
        });
      });

      achievementsData.forEach(achievement => {
        expect(achievement.fullDescription).not.toMatch(/\bdollars?\b/i);
        expect(achievement.fullDescription).not.toMatch(/\bUSD\b/);
        expect(achievement.fullDescription).not.toContain('$');
      });
    });
  });
});
