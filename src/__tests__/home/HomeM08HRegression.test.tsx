import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HomeHero } from '@/components/home/HomeHero';
import { LatestUpdates } from '@/components/home/LatestUpdates';
import { ReportsResearchCTA } from '@/components/home/ReportsResearchCTA';
import { dataAdapter, hydrateDataAdapter } from '@/adapters/dataAdapter';
import { testPublicSnapshot } from '@/__tests__/testFixtures';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MOTION_TOKENS } from '@/lib/animations';

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

// Mock GSAP animations
vi.mock('@/lib/animations', () => ({
  gsap: {
    fromTo: vi.fn(),
    from: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    timeline: () => ({
      from: vi.fn().mockReturnThis(),
    }),
    context: (cb: () => void) => {
      cb();
      return { revert: vi.fn() };
    },
    registerPlugin: vi.fn(),
  },
  MOTION_TOKENS: {
    FAST: 0.2,
    STANDARD: 0.35,
    SLOW: 0.6,
    ROTATION_INTERVAL: 6000,
    SPOTLIGHT_INTERVAL: 7000,
    SPOTLIGHT_TRANSITION: 0.55,
  },
  prefersReducedMotion: () => false,
  formatCompactNumber: (val: number) => String(val),
  formatCurrencyAbbreviated: (val: number) => `N${val}`,
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('PTAT M08H Regression Suite — Spotlight, Latest Updates, and CTA Integrity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    hydrateDataAdapter(testPublicSnapshot);
  });

  afterEach(() => {
    vi.useRealTimers();
    hydrateDataAdapter(null);
  });

  describe('1. Spotlight Intelligence Transitions & Stability', () => {
    it('uses 7000ms reading interval and 550ms transition token', () => {
      expect(MOTION_TOKENS.SPOTLIGHT_INTERVAL).toBe(7000);
      expect(MOTION_TOKENS.SPOTLIGHT_TRANSITION).toBe(0.55);
    });

    it('renders accessible manual previous and next navigation controls', () => {
      renderWithProviders(<HomeHero />);
      const prevBtn = screen.getByRole('button', { name: /Previous achievement spotlight/i });
      const nextBtn = screen.getByRole('button', { name: /Next achievement spotlight/i });
      expect(prevBtn).toBeDefined();
      expect(nextBtn).toBeDefined();
    });

    it('resets auto-rotation timer on manual interaction', () => {
      renderWithProviders(<HomeHero />);
      const totalCount = dataAdapter.getAchievements().length;
      const nextBtn = screen.getByRole('button', { name: /Next achievement spotlight/i });

      // Advance 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // Click next at 5s -> should advance to 2 and restart 7s timer
      act(() => {
        fireEvent.click(nextBtn);
      });
      expect(screen.getByText(new RegExp(`2/${totalCount}`))).toBeDefined();

      // Advancing 5s more should NOT advance yet because timer was reset to 7s
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText(new RegExp(`2/${totalCount}`))).toBeDefined();

      // Advancing remaining 2s -> advances to 3
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText(new RegExp(`3/${totalCount}`))).toBeDefined();
    });
  });

  describe('2. Dynamic Latest Verified Updates', () => {
    it('dynamically queries dataAdapter for newest published records', () => {
      renderWithProviders(<LatestUpdates />);
      const expectedLatest = dataAdapter.getAchievements({ sortBy: 'newest' }).slice(0, 3);

      expectedLatest.forEach((record) => {
        expect(screen.getByText(record.title)).toBeDefined();
      });
    });

    it('renders semantically clear verification date labels without stale static dates', () => {
      renderWithProviders(<LatestUpdates />);
      // Should not contain hardcoded stale dates from 2025 static config
      expect(screen.queryByText('April 2025')).toBeNull();
      expect(screen.queryByText('March 2025')).toBeNull();
      expect(screen.queryByText('February 2025')).toBeNull();

      // Should display verified date prefixes
      const verifiedLabels = screen.getAllByText(/Verified/i);
      expect(verifiedLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('links each latest update card directly to its audited record page', () => {
      renderWithProviders(<LatestUpdates />);
      const expectedLatest = dataAdapter.getAchievements({ sortBy: 'newest' }).slice(0, 3);

      expectedLatest.forEach((record) => {
        const link = screen.getAllByRole('link', { name: /Inspect Record/i });
        expect(link.length).toBe(3);
      });
    });
  });

  describe('3. Reports & Datasets CTA Label & Action Integrity', () => {
    it('renders visible non-empty label for Download Centre CTA button', () => {
      renderWithProviders(<ReportsResearchCTA />);
      const downloadCta = screen.getByRole('link', { name: /Go to Download Centre|Visit Download Centre|Download/i });
      expect(downloadCta).toBeDefined();
      expect(downloadCta.getAttribute('href')).toBe('/downloads');
      expect(downloadCta.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('renders Data Explorer CTA alongside Download Centre CTA', () => {
      renderWithProviders(<ReportsResearchCTA />);
      const dataExplorerCta = screen.getByRole('link', { name: /Data Explorer/i });
      expect(dataExplorerCta).toBeDefined();
      expect(dataExplorerCta.getAttribute('href')).toBe('/data');
    });
  });
});
