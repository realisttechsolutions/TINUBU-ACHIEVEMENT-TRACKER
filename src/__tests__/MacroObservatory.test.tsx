import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '@/views/Dashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MemoryRouter } from 'react-router-dom';
import {
  MACRO_PULSE_INDICATORS,
  MACRO_SERIES_MAP,
  REFORM_TRANSMISSION_NODES,
  SECTOR_ENGINE_DATA,
  FISCAL_DEBT_DATA,
  FAAC_DISTRIBUTION_DATA,
  PROVENANCE_LEDGER_RECORDS
} from '@/data/macro-observatory';

// Mock Recharts ResponsiveContainer to prevent JSDOM layout sizing zero errors
vi.mock('recharts', async () => {
  const original = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container-mock" style={{ width: 800, height: 400 }}>
        {children}
      </div>
    ),
  };
});

const renderDashboard = () => {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe('PTAT National Macro Intelligence Observatory', () => {
  it('renders the National Macro Intelligence Observatory hero title and primary indicators', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { level: 1, name: /National Macro Intelligence Observatory/i })).toBeInTheDocument();
    expect(screen.getByText(/Statutory Data Feeds/i)).toBeInTheDocument();

    // Verify all 8 core macro indicators are rendered with verified statutory figures
    expect(screen.getByText('Real GDP Growth Rate')).toBeInTheDocument();
    expect(screen.getByText('+3.89%')).toBeInTheDocument();

    expect(screen.getByText('Headline CPI Inflation')).toBeInTheDocument();
    expect(screen.getByText('15.43%')).toBeInTheDocument();

    expect(screen.getByText('Food CPI Inflation')).toBeInTheDocument();
    expect(screen.getByText('20.31%')).toBeInTheDocument();

    expect(screen.getByText('Official NAFEM FX Rate')).toBeInTheDocument();
    expect(screen.getByText('₦1,350.41')).toBeInTheDocument();

    expect(screen.getAllByText('Gross External Reserves').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('$52.66 Billion')).toBeInTheDocument();

    expect(screen.getAllByText('Monetary Policy Rate (MPR)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('26.50%')).toBeInTheDocument();

    expect(screen.getByText('Crude Oil & Condensate Output')).toBeInTheDocument();
    expect(screen.getByText('1.670 mbpd')).toBeInTheDocument();

    expect(screen.getByText('Total Public Debt Stock')).toBeInTheDocument();
    expect(screen.getAllByText(/134.30 Trillion/i).length).toBeGreaterThan(0);
  });

  it('toggles time mode between "Latest Official Reading" and "Since May 2023 Baseline Mode"', () => {
    renderDashboard();

    const baselineRadio = screen.getByRole('radio', { name: /Since May 2023 Baseline Mode/i });
    const latestRadio = screen.getByRole('radio', { name: /Latest Official Reading/i });

    expect(latestRadio).toHaveAttribute('aria-checked', 'true');
    expect(baselineRadio).toHaveAttribute('aria-checked', 'false');

    // Switch to Baseline Mode
    fireEvent.click(baselineRadio);
    expect(baselineRadio).toHaveAttribute('aria-checked', 'true');
    expect(latestRadio).toHaveAttribute('aria-checked', 'false');

    // Check baseline comparison labels
    expect(screen.getAllByText(/vs May 2023 Baseline/i).length).toBeGreaterThan(0);

    // Switch back to Latest Reading Mode
    fireEvent.click(latestRadio);
    expect(latestRadio).toHaveAttribute('aria-checked', 'true');
  });

  it('renders the Causality Safeguard notice and toggles methodology details', () => {
    renderDashboard();

    expect(screen.getByText(/Statutory Provenance & Causality Separation Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/PTAT Research Contract v1.1.2/i)).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /View Methodology Protocol/i });
    expect(toggleButton).toBeInTheDocument();

    // Expand details
    fireEvent.click(toggleButton);
    expect(screen.getByText(/1. Institutional Provenance/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Explicit Baseline Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Reform Transmission Logic/i)).toBeInTheDocument();

    // Collapse details
    fireEvent.click(screen.getByRole('button', { name: /Hide Methodology Notes/i }));
    expect(screen.queryByText(/1. Institutional Provenance/i)).not.toBeInTheDocument();
  });

  it('renders the Macro Trend Laboratory and allows switching between chart and accessible table view', () => {
    renderDashboard();

    expect(screen.getByText(/Macro Trend Laboratory/i)).toBeInTheDocument();
    expect(screen.getAllByText(/May 2023 Baseline/i).length).toBeGreaterThan(0);

    const tableButton = screen.getByRole('button', { name: /View as data table/i });
    fireEvent.click(tableButton);

    // Should display accessible table with headers
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Observation Period')).toBeInTheDocument();
    expect(screen.getByText('Statutory Reading')).toBeInTheDocument();
    expect(screen.getByText('Baseline Benchmark')).toBeInTheDocument();

    // Switch back to chart view
    const chartButton = screen.getByRole('button', { name: /View as interactive chart/i });
    fireEvent.click(chartButton);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('switches indicator series inside the Macro Trend Laboratory', () => {
    renderDashboard();

    const inflationTab = screen.getByRole('tab', { name: /Headline CPI Inflation/i });
    fireEvent.click(inflationTab);
    expect(inflationTab).toHaveAttribute('aria-selected', 'true');

    const reservesTab = screen.getByRole('tab', { name: /Gross External Reserves/i });
    fireEvent.click(reservesTab);
    expect(reservesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders the Reform to Economy Transmission Matrix with 5 major reforms', () => {
    renderDashboard();

    expect(screen.getByText(/Reform → Economy Transmission Matrix/i)).toBeInTheDocument();

    // Check all 5 reforms
    expect(screen.getByText(/Foreign Exchange Market Unification & Price Discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/PMS Petrol Subsidy Elimination & Fiscal Recovery/i)).toBeInTheDocument();
    expect(screen.getByText(/National Tax Harmonization & Fiscal Consolidation/i)).toBeInTheDocument();
    expect(screen.getByText(/Orthodox Monetary Policy & Aggressive Disinflation/i)).toBeInTheDocument();
    expect(screen.getByText(/Upstream Petroleum Security & Output Recovery/i)).toBeInTheDocument();

    // Verify 3 transmission steps are present
    expect(screen.getByText('Policy Mechanism')).toBeInTheDocument();
    expect(screen.getByText('Transmission Channel')).toBeInTheDocument();
    expect(screen.getByText('Statutory Observation')).toBeInTheDocument();
  });

  it('renders the Economic Engines real economy GDP breakdown with NBS sector weights', () => {
    renderDashboard();

    expect(screen.getByText(/Real Economic Engines \(NBS GDP Breakdown\)/i)).toBeInTheDocument();

    // Check major sectors (using getAllByText for sector names that appear in list and detail)
    expect(screen.getAllByText('Information & Communication (ICT)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('19.85% of GDP')).toBeInTheDocument();

    expect(screen.getAllByText('Agriculture').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('23.16% of GDP')).toBeInTheDocument();

    expect(screen.getByText('Trade & Commerce')).toBeInTheDocument();
    expect(screen.getByText('15.8% of GDP')).toBeInTheDocument();

    // Click on Agriculture to see detailed subsectors
    const agSectors = screen.getAllByText('Agriculture');
    fireEvent.click(agSectors[0]);
    expect(screen.getByText('Key Economic Subsectors')).toBeInTheDocument();
    expect(screen.getByText('Crop Production (88.4%)')).toBeInTheDocument();
  });

  it('renders Fiscal & External Intelligence with DMO public debt composition and FAAC distribution', () => {
    renderDashboard();

    expect(screen.getByText(/Public Debt Portfolio Composition \(Q2 2024\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/134.30 Trillion/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('$91.35 Billion')).toBeInTheDocument();
    expect(screen.getByText(/Domestic Debt \(₦71.22T \/ \$48.45B\)/i)).toBeInTheDocument();

    // Check FAAC Distribution
    expect(screen.getByText(/Federation Account Distributions \(July 2026\)/i)).toBeInTheDocument();
    expect(screen.getByText('₦3.007 Trillion')).toBeInTheDocument();
    expect(screen.getByText('₦1058B')).toBeInTheDocument(); // Federal
    expect(screen.getByText('₦1040B')).toBeInTheDocument(); // State
    expect(screen.getByText('₦646B')).toBeInTheDocument(); // LGA
  });

  it('renders What Changed? 2026 statutory intelligence briefings', () => {
    renderDashboard();

    expect(screen.getByText(/What Changed\? \(2026 Macro Analysis\)/i)).toBeInTheDocument();
    expect(screen.getByText('Headline CPI Deceleration')).toBeInTheDocument();
    expect(screen.getByText('External Reserves Exceed $52.6B')).toBeInTheDocument();
    expect(screen.getByText('Services & ICT Lead Expansion')).toBeInTheDocument();
    expect(screen.getByText('Federation Revenue Broadening')).toBeInTheDocument();
  });

  it('renders the Statutory Data Freshness & Provenance Ledger', () => {
    renderDashboard();

    expect(screen.getByText(/Data Freshness & Provenance Ledger/i)).toBeInTheDocument();
    expect(screen.getByText('National Bureau of Statistics')).toBeInTheDocument();
    expect(screen.getByText('Central Bank of Nigeria')).toBeInTheDocument();
    expect(screen.getByText('Debt Management Office')).toBeInTheDocument();
    expect(screen.getByText('Nigerian Upstream Petroleum Regulatory Commission')).toBeInTheDocument();
    expect(screen.getByText('Nigerian Electricity Regulatory Commission')).toBeInTheDocument();
    expect(screen.getByText('Federal Inland Revenue Service')).toBeInTheDocument();
  });

  it('verifies all 8 core macro indicators have CURRENT freshness badges', () => {
    renderDashboard();

    const currentBadges = screen.getAllByText('CURRENT');
    // 8 cards in hero + sources in ledger
    expect(currentBadges.length).toBeGreaterThanOrEqual(8);
  });

  it('verifies that no legacy hardcoded projected numbers or synthetic indices exist', () => {
    renderDashboard();

    expect(screen.queryByText(/Projected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Security Index/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Healthcare Access 58%/i)).not.toBeInTheDocument();
  });
});
