import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HomeHero from '@/components/home/HomeHero';

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

// Mock GSAP to prevent jsdom transform warnings
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
  },
  prefersReducedMotion: () => false,
}));

describe('PTAT HomeHero Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders stable H1 and official mandate eyebrow pill', () => {
    render(<HomeHero />);
    expect(screen.getByRole('heading', { level: 1, name: /National Achievements & Evidence Intelligence/i })).toBeDefined();
    expect(screen.getByText(/Official Progress Record • 29 May 2023 — August 2026/i)).toBeDefined();
  });

  it('renders all three CTAs with visible labels and correct destination links', () => {
    render(<HomeHero />);
    
    // Primary CTA
    const primaryCta = screen.getByRole('link', { name: /Explore Achievements/i });
    expect(primaryCta).toBeDefined();
    expect(primaryCta.getAttribute('href')).toBe('/achievements');

    // Secondary CTA (Nigeria Impact Map - verified visible and high-contrast)
    const secondaryCta = screen.getByRole('link', { name: /Nigeria Impact Map/i });
    expect(secondaryCta).toBeDefined();
    expect(secondaryCta.getAttribute('href')).toBe('/impact-map');
    expect(secondaryCta.textContent).toContain('Nigeria Impact Map');

    // Tertiary CTA (Data Explorer)
    const tertiaryCta = screen.getByRole('link', { name: /Data Explorer/i });
    expect(tertiaryCta).toBeDefined();
    expect(tertiaryCta.getAttribute('href')).toBe('/data');
  });

  it('renders rotating supporting intelligence line with aria-live status', () => {
    render(<HomeHero />);
    const statusContainer = screen.getByRole('status');
    expect(statusContainer).toBeDefined();
    expect(statusContainer.getAttribute('aria-live')).toBe('polite');
    expect(screen.getByText(/See the verifiable primary evidence behind national progress/i)).toBeDefined();

    // Fast-forward 6s to test statement rotation
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByText(/Follow policy reforms from gazette announcement to measurable impact/i)).toBeDefined();
  });

  it('renders interactive achievement spotlight with manual navigation controls', () => {
    render(<HomeHero />);
    
    // Initial active spotlight: NELFUND
    expect(screen.getByText(/NELFUND Tertiary Student Loan & Upkeep Scheme/i)).toBeDefined();
    expect(screen.getByText('1/4')).toBeDefined();

    // Click Next button
    const nextButton = screen.getByRole('button', { name: /Next achievement spotlight/i });
    act(() => {
      fireEvent.click(nextButton);
    });

    // Second active spotlight: Lagos-Calabar
    expect(screen.getByText(/700km Lagos-Calabar Coastal Superhighway/i)).toBeDefined();
    expect(screen.getByText('2/4')).toBeDefined();

    // Click Previous button
    const prevButton = screen.getByRole('button', { name: /Previous achievement spotlight/i });
    act(() => {
      fireEvent.click(prevButton);
    });

    // Back to NELFUND
    expect(screen.getByText(/NELFUND Tertiary Student Loan & Upkeep Scheme/i)).toBeDefined();
    expect(screen.getByText('1/4')).toBeDefined();
  });

  it('renders certified macro truth counters without hallucinated numbers', () => {
    render(<HomeHero />);
    expect(screen.getByText('15')).toBeDefined();
    expect(screen.getByText('Canonical Sectors')).toBeDefined();
    expect(screen.getByText('36 + FCT')).toBeDefined();
    expect(screen.getByText('Sub-National Scope')).toBeDefined();
    expect(screen.getByText('100%')).toBeDefined();
    expect(screen.getByText('Cited Evidence')).toBeDefined();
  });
});
