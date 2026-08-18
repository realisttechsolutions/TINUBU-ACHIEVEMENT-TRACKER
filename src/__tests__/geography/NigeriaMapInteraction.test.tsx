import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NigeriaImpactMap from '@/components/geography/NigeriaImpactMap';
import NigeriaMapSvg from '@/components/geography/NigeriaMapSvg';

// Mock navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
  useLocation: () => ({ pathname: '/impact-map' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

describe('NigeriaMapSvg Vector Geometry & Accessibility', () => {
  it('renders exactly 37 interactive state button paths', () => {
    const { container } = render(<NigeriaMapSvg />);
    const buttons = container.querySelectorAll('path[role="button"]');
    expect(buttons.length).toBe(37);
  });

  it('exposes accessible state names and zone labels on polygon buttons', () => {
    render(<NigeriaMapSvg selectedStateCode="NG-LA" />);
    const lagosPath = screen.getByRole('button', { name: /Lagos State.*South-West/i });
    expect(lagosPath).toBeDefined();
    expect(lagosPath.getAttribute('aria-pressed')).toBe('true');

    const kanoPath = screen.getByRole('button', { name: /Kano State.*North-West/i });
    expect(kanoPath).toBeDefined();
    expect(kanoPath.getAttribute('aria-pressed')).toBe('false');
  });

  it('triggers onStateSelect callback on click and on Enter keydown', () => {
    const handleSelect = vi.fn();
    render(<NigeriaMapSvg onStateSelect={handleSelect} />);

    const lagosPath = screen.getByRole('button', { name: /Lagos State/i });
    fireEvent.click(lagosPath);
    expect(handleSelect).toHaveBeenCalledWith('NG-LA');

    const kanoPath = screen.getByRole('button', { name: /Kano State/i });
    fireEvent.keyDown(kanoPath, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('NG-KN');
  });
});

describe('NigeriaImpactMap Layout & Interaction', () => {
  it('renders interactive map with selected state inspector panel and boundary attribution', () => {
    render(<NigeriaImpactMap />);
    
    // Initial default state: Lagos
    expect(screen.getByText('Lagos State')).toBeDefined();
    expect(screen.getByText('South-West Zone')).toBeDefined();
    expect(screen.getByText('NG-LA')).toBeDefined();
    expect(screen.getByText('Ikeja')).toBeDefined();
    expect(screen.getByText(/View Complete Lagos State Dashboard/i)).toBeDefined();

    // Provenance & Boundary Attribution
    expect(screen.getByText(/Boundary geometry source:/i)).toBeDefined();
    expect(screen.getByText(/geoBoundaries \(CC-BY 4.0\) \/ GRID3 Nigeria/i)).toBeDefined();
  });

  it('updates state inspector panel when a different state is selected', () => {
    const { container } = render(<NigeriaImpactMap />);
    
    const kanoPath = screen.getByRole('button', { name: /Kano State/i });
    fireEvent.click(kanoPath);

    expect(screen.getByRole('heading', { level: 3, name: 'Kano State' })).toBeDefined();
    expect(screen.getByText('North-West Zone')).toBeDefined();
    expect(screen.getByText('NG-KN')).toBeDefined();
    expect(screen.getAllByText('Kano').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/View Complete Kano State Dashboard/i)).toBeDefined();
  });


  it('toggles to accessible table view and renders state directory with search filter', () => {
    render(<NigeriaImpactMap />);

    // Click Accessible Table List button
    const tableToggle = screen.getByRole('button', { name: /Accessible Table List/i });
    fireEvent.click(tableToggle);

    expect(screen.getByText(/State-by-State Impact Directory/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Filter states by name, capital.../i)).toBeDefined();

    // Check presence of multiple states in table
    expect(screen.getByRole('link', { name: 'Abia State' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Lagos State' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Kano State' })).toBeDefined();

    // Filter by search term
    const searchInput = screen.getByPlaceholderText(/Filter states by name, capital.../i);
    fireEvent.change(searchInput, { target: { value: 'Kaduna' } });

    expect(screen.getByRole('link', { name: 'Kaduna State' })).toBeDefined();
    expect(screen.queryByRole('link', { name: 'Lagos State' })).toBeNull();
  });
});
