import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BrandLockup from '@/components/layout/BrandLockup';
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import AppShell from '@/components/layout/AppShell';
import ImpactMapPage from '@/views/ImpactMapPage';
import StatesCatalogue from '@/views/StatesCatalogue';
import Dashboard from '@/views/Dashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({ slug: 'test-policy' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

// Mock translation hook
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    currentLanguage: 'en',
  }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('Canonical PTAT Application Shell & Branding', () => {
  it('renders PTAT badge and President Tinubu Achievement Tracker in BrandLockup', () => {
    renderWithProviders(<BrandLockup />);
    expect(screen.getByText('PTAT')).toBeDefined();
    expect(screen.getByText('President Tinubu Achievement Tracker')).toBeDefined();
    expect(screen.getByLabelText('President Tinubu Achievement Tracker - Return to homepage')).toBeDefined();
  });

  it('renders single GlobalHeader with mobile trigger and brand lockup', () => {
    renderWithProviders(<GlobalHeader />);
    const headers = screen.getAllByRole('banner');
    expect(headers.length).toBe(1);
    expect(screen.getByLabelText('Open mobile navigation menu')).toBeDefined();
    expect(screen.getByLabelText('Main Navigation')).toBeDefined();
  });

  it('renders GlobalFooter with PTAT copyright and 18 truth safeguards statement', () => {
    renderWithProviders(<GlobalFooter />);
    const footers = screen.getAllByRole('contentinfo');
    expect(footers.length).toBe(1);
    const brandOccurrences = screen.getAllByText(/President Tinubu Achievement Tracker \(PTAT\)/);
    expect(brandOccurrences.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/18 immutable truth safeguards/)).toBeDefined();
  });

  it('renders AppShell wrapping children with exactly one header and one footer', () => {
    renderWithProviders(
      <AppShell>
        <div data-testid="page-content">Main Page Body</div>
      </AppShell>
    );
    expect(screen.getByTestId('page-content')).toBeDefined();
    expect(screen.getAllByRole('banner').length).toBe(1);
    expect(screen.getAllByRole('contentinfo').length).toBe(1);
  });
});

describe('Absence of Nested Duplicate Navbars in Routed Views', () => {
  it('renders ImpactMapPage without nested duplicate header banner or footer', () => {
    const { container } = renderWithProviders(<ImpactMapPage />);
    expect(container.querySelectorAll('header').length).toBe(0);
    expect(container.querySelectorAll('footer').length).toBe(0);
  });

  it('renders StatesCatalogue without nested duplicate header banner or footer', () => {
    const { container } = renderWithProviders(<StatesCatalogue />);
    expect(container.querySelectorAll('header').length).toBe(0);
    expect(container.querySelectorAll('footer').length).toBe(0);
  });

  it('renders Dashboard without nested duplicate header banner or footer', () => {
    const { container } = renderWithProviders(<Dashboard />);
    expect(container.querySelectorAll('header').length).toBe(0);
    expect(container.querySelectorAll('footer').length).toBe(0);
  });
});
