import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DEMO_ACHIEVEMENTS, CANONICAL_SECTORS, DEMO_NIGERIA_STATES } from "@/adapters/canonicalData";
import { dataAdapter, hydrateDataAdapter } from "@/adapters/dataAdapter";
import { AchievementFilterBar, FilterState } from "@/components/achievements/AchievementFilterBar";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AchievementViewModel } from "@/adapters/types";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

const publishedTestRecord: AchievementViewModel = {
  id: "ACH-001",
  slug: "nelfund-student-loan-disbursement",
  title: "NELFUND Tertiary Student Loan & Upkeep Scheme",
  summary: "Direct institutional tuition disbursements and student monthly stipends across 100+ public institutions.",
  description: "Full audited narrative text.",
  sectorId: "education_human_capital",
  sectorName: "Education & Human Capital",
  publicNavigationGroup: "governance",
  publicNavigationGroupLabel: "Governance & Human Development",
  recordType: "programme",
  recordTypeLabel: "National Social Programme",
  status: "operational",
  statusLabel: "Operational",
  statusCategory: "delivered",
  date: "2024-05-24",
  datePrecision: "exact_day",
  leadMda: "Nigerian Education Loan Fund (NELFUND)",
  geographicScope: "national",
  statesCovered: ["National"],
  featured: true,
  sourceOrigin: "government_reported",
  dataValueNature: "actual",
  verificationStatus: "source_confirmed",
  publicationStatus: "published",
  evidenceProfile: "comprehensive",
  evidenceProfileLabel: "Comprehensive Empirical",
  evidenceClaims: [],
  financialMetrics: [],
  beneficiaryMetrics: [],
  isDemo: false,
};

describe("PTAT Public Data Experience & Demo Data Isolation Tests", () => {
  afterEach(() => {
    hydrateDataAdapter(null);
  });

  describe("Demo Fixture Truth & Public Gate Isolation", () => {
    it("ensures demo fixture records in canonicalData.ts retain their truthful isDemo: true flag", () => {
      expect(DEMO_ACHIEVEMENTS.length).toBeGreaterThan(0);
      DEMO_ACHIEVEMENTS.forEach((achievement) => {
        expect(achievement.isDemo).toBe(true);
        expect(achievement.id).toMatch(/^ACH-DEMO-/);
      });
    });

    it("ensures public dataAdapter eliminates demo fixtures when Cloud SQL is unavailable", () => {
      hydrateDataAdapter(null);
      const publicAchievements = dataAdapter.getAchievements();
      expect(publicAchievements.length).toBe(0);

      const publicProjects = dataAdapter.getProjects();
      expect(publicProjects.length).toBe(0);

      const publicPolicies = dataAdapter.getPolicies();
      expect(publicPolicies.length).toBe(0);

      const publicProgrammes = dataAdapter.getProgrammes();
      expect(publicProgrammes.length).toBe(0);

      const publicTimeline = dataAdapter.getTimelineEvents();
      expect(publicTimeline.length).toBe(0);

      const publicDatasets = dataAdapter.getDatasets();
      expect(publicDatasets.length).toBe(0);
    });

    it("ensures reference dimensions (states and canonical sectors) remain available to the public", () => {
      hydrateDataAdapter(null);
      const sectors = dataAdapter.getSectors();
      expect(sectors.length).toBe(15);
      expect(CANONICAL_SECTORS.length).toBe(15);

      const states = dataAdapter.getStates();
      expect(states.length).toBe(37); // 36 States + FCT
      expect(DEMO_NIGERIA_STATES.length).toBe(37);
    });

    it("allows real published Cloud SQL records to flow through the public dataAdapter", () => {
      hydrateDataAdapter({
        source: "cloud-sql",
        loadedAt: new Date().toISOString(),
        achievements: [publishedTestRecord],
        sectors: CANONICAL_SECTORS,
        projects: [],
        policies: [],
        programmes: [],
        timelineEvents: [],
        states: DEMO_NIGERIA_STATES,
        datasets: [],
        publicDownload: [],
        macroCounters: {
          timeframe: "2023 — 2026",
          verifiedAchievements: 1,
          canonicalSectors: 15,
          capitalProjectsActive: 0,
          subNationalStatesTracked: 37,
          studentBeneficiariesFormatted: "350,000+",
          externalReservesFormatted: "Buffer",
          highwayKilometersFormatted: "2,400+ km",
          lastAuditSync: "2026-08-15"
        }
      });

      const records = dataAdapter.getAchievements();
      expect(records.length).toBe(1);
      expect(records[0].id).toBe("ACH-001");
      expect(records[0].isDemo).toBe(false);
    });
  });

  describe("AchievementFilterBar Public UX Simplification", () => {
    const initialFilters: FilterState = {
      searchQuery: "",
      publicGroup: "all",
      sectorId: "all",
      status: "all",
      state: "all",
      year: "all",
      sortBy: "newest",
    };

    it("renders without any Verification dropdown or Verification Tier options", () => {
      renderWithProviders(
        <AchievementFilterBar
          filters={initialFilters}
          onFilterChange={vi.fn()}
          viewMode="grid"
          onViewModeChange={vi.fn()}
          onResetFilters={vi.fn()}
          totalResultsCount={0}
        />
      );

      // Verify no verification dropdown label or options exist
      expect(screen.queryByText(/Verification/i)).toBeNull();
      expect(screen.queryByText(/All Verification Tiers/i)).toBeNull();
      expect(screen.queryByText(/Source Confirmed/i)).toBeNull();
      expect(screen.queryByText(/Independently Corroborated/i)).toBeNull();
      expect(screen.queryByText(/Cross Referenced/i)).toBeNull();
      expect(screen.queryByText(/Under Review/i)).toBeNull();

      // Verify public-facing counter format
      expect(screen.getByText(/^0$/)).toBeInTheDocument();
      expect(screen.getByText(/records match your filters/i)).toBeInTheDocument();
    });

    it("triggers filter changes for sector, state, status, year, and search query", () => {
      const onFilterChange = vi.fn();
      renderWithProviders(
        <AchievementFilterBar
          filters={initialFilters}
          onFilterChange={onFilterChange}
          viewMode="grid"
          onViewModeChange={vi.fn()}
          onResetFilters={vi.fn()}
          totalResultsCount={10}
        />
      );

      // Search input change
      const searchInput = screen.getByPlaceholderText(/Search policies, projects, MDAs/i);
      fireEvent.change(searchInput, { target: { value: "NELFUND" } });
      expect(onFilterChange).toHaveBeenCalledWith({ searchQuery: "NELFUND" });

      // Sector select change
      const sectorSelect = screen.getByLabelText(/Filter by Sector/i);
      fireEvent.change(sectorSelect, { target: { value: "education_human_capital" } });
      expect(onFilterChange).toHaveBeenCalledWith({ sectorId: "education_human_capital" });

      // Status select change
      const statusSelect = screen.getByLabelText(/Filter by Implementation Status/i);
      fireEvent.change(statusSelect, { target: { value: "operational" } });
      expect(onFilterChange).toHaveBeenCalledWith({ status: "operational" });
    });
  });

  describe("AchievementCard Visual Presentation", () => {
    it("renders published record cleanly without internal verification badges or synthetic watermarks in grid view", () => {
      renderWithProviders(
        <AchievementCard item={publishedTestRecord} viewMode="grid" />
      );

      // Verify absence of DEMO watermark
      expect(screen.queryByText(/DEMO/i)).toBeNull();
      expect(screen.queryByText(/SYNTHETIC/i)).toBeNull();
      expect(screen.queryByText(/PROTOTYPE/i)).toBeNull();

      // Verify absence of internal verification badges
      expect(screen.queryByText(/SOURCE CONFIRMED/i)).toBeNull();
      expect(screen.queryByText(/INDEPENDENTLY CORROBORATED/i)).toBeNull();

      // Verify card content renders cleanly
      expect(screen.getByText(publishedTestRecord.title)).toBeInTheDocument();
    });

    it("renders published record cleanly without internal verification badges or synthetic watermarks in list view", () => {
      renderWithProviders(
        <AchievementCard item={publishedTestRecord} viewMode="list" />
      );

      expect(screen.queryByText(/DEMO/i)).toBeNull();
      expect(screen.queryByText(/SYNTHETIC/i)).toBeNull();
      expect(screen.queryByText(/SOURCE CONFIRMED/i)).toBeNull();
      expect(screen.getByText(publishedTestRecord.title)).toBeInTheDocument();
    });
  });
});
