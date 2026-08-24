import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import TimelineEventDetail from "@/views/TimelineEventDetail";
import { dataAdapter, hydrateDataAdapter } from "@/adapters/dataAdapter";
import { testPublicSnapshot } from "./testFixtures";

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[]) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe("Timeline Event Intelligence Dossier", () => {
  beforeEach(() => {
    hydrateDataAdapter(testPublicSnapshot);
  });

  afterEach(() => {
    hydrateDataAdapter(null);
  });

  it("renders dedicated 2023 event dossier on direct URL load (Fuel Subsidy Proclamation)", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/fuel-subsidy-removal-proclamation"]
    );

    expect(screen.getByRole("heading", { level: 1, name: /Presidential Inaugural Proclamation & Fuel Subsidy Removal/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Event ID: tle-2023-001/i)).toBeInTheDocument();
    expect(screen.getAllByText("2023-05-29").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Executive Brief • What Occurred & Why It Matters/i)).toBeInTheDocument();
  });

  it("renders dedicated 2024 event dossier (Mining Marshals Special Operations)", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/mining-marshals-special-operations-deployment"]
    );

    expect(screen.getByRole("heading", { level: 1, name: /Mining Marshals Elite Corps Deployed/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Event ID: tle-2024-002/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ministry of Solid Minerals Development/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("2024-03-21").length).toBeGreaterThanOrEqual(1);
  });

  it("renders dedicated 2025 event dossier (NELFUND Disbursements Exceed ₦322 Billion)", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/nelfund-disbursements-exceed-322-billion"]
    );

    expect(screen.getByRole("heading", { level: 1, name: /NELFUND Student Loan Institutional Remittances Exceed ₦322 Billion/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Event ID: tle-2025-002/i)).toBeInTheDocument();
    expect(screen.getAllByText("2025-03-15").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Associated Canonical Public Record/i)).toBeInTheDocument();
  });

  it("renders dedicated 2026 event dossier (NBS Macro Observatory Q1 2026 GDP Growth)", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/q1-2026-nbs-macroeconomic-report-growth-surge"]
    );

    expect(screen.getByRole("heading", { level: 1, name: /NBS Macro Observatory Report: Q1 2026 GDP Growth Reaches 3.89%/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Event ID: tle-2026-004/i)).toBeInTheDocument();
    expect(screen.getAllByText("2026-08-15").length).toBeGreaterThanOrEqual(1);
  });

  it("resolves event by immutable ID directly (/timeline/tle-2024-001)", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/tle-2024-001"]
    );

    expect(screen.getByRole("heading", { level: 1, name: /FEC Approves 700km Lagos-Calabar Coastal Highway Corridor/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Event ID: tle-2024-001/i)).toBeInTheDocument();
  });

  it("renders associated canonical record callout when linkage exists", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/student-loans-act-2024-enactment"]
    );

    expect(screen.getByText(/Associated Canonical Public Record/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Dedicated Achievement Intelligence Dossier/i })).toBeInTheDocument();
  });

  it("renders cleanly without associated record callout when event is standalone", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/food-security-state-of-emergency"]
    );

    expect(screen.getByRole("heading", { level: 1, name: /President Declares National State of Emergency on Food Security/i })).toBeInTheDocument();
    expect(screen.queryByText(/Associated Canonical Public Record/i)).not.toBeInTheDocument();
  });

  it("renders primary statutory citations, gazette badges, and locators", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/electricity-act-2023-enactment"]
    );

    expect(screen.getByText(/Primary Statutory Citations & Verification Basis/i)).toBeInTheDocument();
    expect(screen.getByText(/Electricity Act 2023 \(Act No\. 22\) Official Gazette/i)).toBeInTheDocument();
  });

  it("renders record navigation bar with adjacent event links", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/mining-marshals-special-operations-deployment"]
    );

    expect(screen.getByRole("link", { name: /Explore 2024 Milestones/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /All Timeline Milestones/i })).toBeInTheDocument();
  });

  it("gracefully renders 404 state when an unknown timeline event ID is requested", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline/:slug" element={<TimelineEventDetail />} />
      </Routes>,
      ["/timeline/unknown-event-id-999"]
    );

    expect(screen.getByText("Timeline Milestone Not Found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Return to Administration Timeline/i })).toBeInTheDocument();
  });
});
