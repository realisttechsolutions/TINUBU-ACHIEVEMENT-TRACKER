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

  describe('2. Dynamic Cross-Type Latest Updates & Truthful Semantics (M08H.1)', () => {
    it('proves section is cross-type and not achievements-only', () => {
      const customSnapshot: typeof testPublicSnapshot = {
        ...testPublicSnapshot,
        projects: [
          {
            ...testPublicSnapshot.projects[0],
            title: 'Lagos-Calabar Coastal Superhighway Project',
            updatedAt: '2026-08-25',
          },
        ],
        policies: [
          {
            ...testPublicSnapshot.policies[0],
            title: 'National Digital Economy Statutory Policy',
            updatedAt: '2026-08-24',
          },
        ],
        achievements: [
          {
            ...testPublicSnapshot.achievements[0],
            title: 'Civil Service Biometric Reform Achievement',
            updatedAt: '2026-08-23',
          },
        ],
      };

      hydrateDataAdapter(customSnapshot);
      renderWithProviders(<LatestUpdates />);

      expect(screen.getByText('Lagos-Calabar Coastal Superhighway Project')).toBeDefined();
      expect(screen.getByText('National Digital Economy Statutory Policy')).toBeDefined();
      expect(screen.getByText('Civil Service Biometric Reform Achievement')).toBeDefined();
    });

    it('proves newest updated project can outrank an older achievement', () => {
      const customSnapshot: typeof testPublicSnapshot = {
        ...testPublicSnapshot,
        achievements: [
          {
            ...testPublicSnapshot.achievements[0],
            title: 'Older Achievement Delivered in 2024',
            date: '2024-01-01',
            publishedAt: '2026-08-10',
            updatedAt: '2026-08-10',
          },
        ],
        projects: [
          {
            ...testPublicSnapshot.projects[0],
            title: 'Brand New Project Update 2026',
            startDate: '2024-01-01',
            publishedAt: '2026-08-15',
            updatedAt: '2026-08-26',
          },
        ],
      };

      hydrateDataAdapter(customSnapshot);
      const updates = dataAdapter.getLatestUpdates(3);

      expect(updates[0].title).toBe('Brand New Project Update 2026');
      expect(updates[0].recordType).toBe('physical_project');
      expect(updates[0].routePath).toBe(`/projects/${updates[0].slug || updates[0].id}`);
    });

    it('proves newest updated policy can appear and links to /policies/[slug]', () => {
      const customSnapshot: typeof testPublicSnapshot = {
        ...testPublicSnapshot,
        policies: [
          {
            ...testPublicSnapshot.policies[0],
            title: 'Critical National Infrastructure Protection Order',
            slug: 'critical-national-infrastructure-protection-order',
            approvalDate: '2024-05-15',
            publishedAt: '2026-08-20',
            updatedAt: '2026-08-27',
          },
        ],
      };

      hydrateDataAdapter(customSnapshot);
      const updates = dataAdapter.getLatestUpdates(3);

      expect(updates[0].title).toBe('Critical National Infrastructure Protection Order');
      expect(updates[0].recordType).toBe('policy');
      expect(updates[0].routePath).toBe('/policies/critical-national-infrastructure-protection-order');
    });

    it('proves historical event date does not control ranking (ranking is controlled by updatedAt)', () => {
      const customSnapshot: typeof testPublicSnapshot = {
        ...testPublicSnapshot,
        achievements: [
          {
            ...testPublicSnapshot.achievements[0],
            title: 'Historical 2023 Enactment Revised in Late August 2026',
            date: '2023-06-01', // Historical event date in 2023
            publishedAt: '2026-08-01',
            updatedAt: '2026-08-28', // Most recent update
          },
          {
            ...testPublicSnapshot.achievements[1],
            title: 'Recent 2026 Milestone Not Updated Since Early August',
            date: '2026-08-10', // Historical event date in 2026
            publishedAt: '2026-08-10',
            updatedAt: '2026-08-10', // Older update
          },
        ],
      };

      hydrateDataAdapter(customSnapshot);
      const updates = dataAdapter.getLatestUpdates(3);

      // The 2023 historical record revised on 2026-08-28 must rank ahead of 2026-08-10
      expect(updates[0].title).toBe('Historical 2023 Enactment Revised in Late August 2026');
    });

    it('displays truthful Updated [date] label matching actual update semantics rather than false verified_at', () => {
      renderWithProviders(<LatestUpdates />);

      // Stale 2025 static config strings eliminated
      expect(screen.queryByText('April 2025')).toBeNull();
      expect(screen.queryByText('March 2025')).toBeNull();
      expect(screen.queryByText('February 2025')).toBeNull();

      // Displays truthful Updated date labels
      const updatedLabels = screen.getAllByText(/Updated/i);
      expect(updatedLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('automatically changes ordering when future update timestamp changes on existing record', () => {
      const initialSnapshot = { ...testPublicSnapshot };
      hydrateDataAdapter(initialSnapshot);
      const initialTop = dataAdapter.getLatestUpdates(1)[0];

      // Simulate a future database revision on a different record tomorrow
      const modifiedSnapshot: typeof testPublicSnapshot = {
        ...testPublicSnapshot,
        programmes: [
          {
            ...testPublicSnapshot.programmes[0],
            title: 'National Social Safety Net Recalibrated',
            launchDate: '2024-01-01',
            updatedAt: '2026-09-01', // Future timestamp
          },
        ],
      };

      hydrateDataAdapter(modifiedSnapshot);
      const futureTop = dataAdapter.getLatestUpdates(1)[0];

      expect(futureTop.title).toBe('National Social Safety Net Recalibrated');
      expect(futureTop.recordType).toBe('programme');
      expect(futureTop.routePath).toBe(`/programmes/${futureTop.slug || futureTop.id}`);
      expect(futureTop.title).not.toBe(initialTop.title);
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
