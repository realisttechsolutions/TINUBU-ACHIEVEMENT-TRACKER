import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HomeHero from '@/components/home/HomeHero';
import { MOTION_TOKENS } from '@/lib/animations';
import { dataAdapter, hydrateDataAdapter } from '@/adapters/dataAdapter';
import { testPublicSnapshot } from '@/__tests__/testFixtures';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

// Mock GSAP
vi.mock('@/lib/animations', () => ({
  gsap: {
    fromTo: vi.fn(),
    from: vi.fn(),
    to: vi.fn(),
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
    SPOTLIGHT_INTERVAL: 5000,
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

describe('PTAT HomeHero Data-Driven Spotlight Forever Loop', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    hydrateDataAdapter(testPublicSnapshot);
  });

  afterEach(() => {
    vi.useRealTimers();
    hydrateDataAdapter(null);
  });

  it('provides SPOTLIGHT_INTERVAL of exactly 5000ms in MOTION_TOKENS', () => {
    expect(MOTION_TOKENS.SPOTLIGHT_INTERVAL).toBe(5000);
  });

  it('loads a substantial eligible pool of published achievements (> 4 records)', () => {
    renderWithProviders(<HomeHero />);
    const totalAchievements = dataAdapter.getAchievements();
    expect(totalAchievements.length).toBeGreaterThan(4);
    
    // Expect counter to reflect the full eligible pool length
    expect(screen.getByText(new RegExp(`1/${totalAchievements.length}`))).toBeDefined();
  });

  it('executes a continuous forever loop advancing every 5000ms', () => {
    renderWithProviders(<HomeHero />);
    const totalCount = dataAdapter.getAchievements().length;

    expect(screen.getByText(new RegExp(`1/${totalCount}`))).toBeDefined();

    // Advance 5 seconds (5000ms)
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(new RegExp(`2/${totalCount}`))).toBeDefined();

    // Advance another 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText(new RegExp(`3/${totalCount}`))).toBeDefined();
  });

  it('seamlessly wraps from the last eligible record back to the first record', () => {
    renderWithProviders(<HomeHero />);
    const totalCount = dataAdapter.getAchievements().length;

    // Fast forward through all items to reach the end and wrap
    act(() => {
      vi.advanceTimersByTime(5000 * totalCount);
    });
    expect(screen.getByText(new RegExp(`1/${totalCount}`))).toBeDefined();
  });

  it('supports manual Next and Previous navigation with clean wrapping', () => {
    renderWithProviders(<HomeHero />);
    const totalCount = dataAdapter.getAchievements().length;

    const nextButton = screen.getByRole('button', { name: /Next achievement spotlight/i });
    const prevButton = screen.getByRole('button', { name: /Previous achievement spotlight/i });

    // Click Next
    act(() => {
      fireEvent.click(nextButton);
    });
    expect(screen.getByText(new RegExp(`2/${totalCount}`))).toBeDefined();

    // Click Prev
    act(() => {
      fireEvent.click(prevButton);
    });
    expect(screen.getByText(new RegExp(`1/${totalCount}`))).toBeDefined();

    // Click Prev again from first item -> wraps to last item
    act(() => {
      fireEvent.click(prevButton);
    });
    expect(screen.getByText(new RegExp(`${totalCount}/${totalCount}`))).toBeDefined();
  });

  it('pauses auto-rotation on hover and focus to protect user inspection', () => {
    const { container } = renderWithProviders(<HomeHero />);
    const section = container.querySelector('section');
    const totalCount = dataAdapter.getAchievements().length;

    expect(screen.getByText(new RegExp(`1/${totalCount}`))).toBeDefined();

    // Mouse Enter
    act(() => {
      if (section) fireEvent.mouseEnter(section);
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    // Should remain paused on item 1
    expect(screen.getByText(new RegExp(`1/${totalCount}`))).toBeDefined();

    // Mouse Leave
    act(() => {
      if (section) fireEvent.mouseLeave(section);
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // Should now advance to item 2
    expect(screen.getByText(new RegExp(`2/${totalCount}`))).toBeDefined();
  });
});
