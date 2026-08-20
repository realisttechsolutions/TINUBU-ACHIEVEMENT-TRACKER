import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NationalImpactPreview from '@/components/home/NationalImpactPreview';
import { LanguageProvider } from '@/contexts/LanguageContext';

const mockNavigate = vi.fn();

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('NationalImpactPreview Homepage Map Gateway', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders interactive Nigeria ADM1 vector map with 37 state paths', () => {
    const { container } = renderWithProviders(<NationalImpactPreview />);
    const buttons = container.querySelectorAll('path[role="button"]');
    expect(buttons.length).toBe(37);
  });

  it('displays state name and geopolitical zone when a state is hovered', () => {
    renderWithProviders(<NationalImpactPreview />);
    const lagosPath = screen.getByRole('button', { name: /Lagos State.*South-West/i });
    
    fireEvent.mouseEnter(lagosPath);
    expect(screen.getByText(/Lagos State \(South-West Zone\)/i)).toBeDefined();
    expect(screen.getByText(/Explore on Map/i)).toBeDefined();
  });

  it('navigates to /impact-map?state=lagos when Lagos State is clicked', () => {
    renderWithProviders(<NationalImpactPreview />);
    const lagosPath = screen.getByRole('button', { name: /Lagos State.*South-West/i });
    
    fireEvent.click(lagosPath);
    expect(mockNavigate).toHaveBeenCalledWith('/impact-map?state=lagos');
  });

  it('navigates to /impact-map?state=kaduna when Kaduna State is activated via keyboard', () => {
    renderWithProviders(<NationalImpactPreview />);
    const kadunaPath = screen.getByRole('button', { name: /Kaduna State.*North-West/i });
    
    fireEvent.keyDown(kadunaPath, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/impact-map?state=kaduna');
  });

  it('navigates to /impact-map?state=fct-abuja when FCT (Abuja) is clicked', () => {
    renderWithProviders(<NationalImpactPreview />);
    const fctPath = screen.getByRole('button', { name: /FCT \(Abuja\)/i });
    
    fireEvent.click(fctPath);
    expect(mockNavigate).toHaveBeenCalledWith('/impact-map?state=fct-abuja');
  });
});
