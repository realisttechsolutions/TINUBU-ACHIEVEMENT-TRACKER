import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import TimelinePage from "@/views/TimelinePage";
import { 
  getAllTimelineEvents, 
  getTimelineStageSummaries, 
  filterTimelineEvents 
} from "@/services/timelineService";
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

describe("Policy Timeline Data Architecture & Year-by-Year Invariant", () => {
  beforeEach(() => {
    hydrateDataAdapter(testPublicSnapshot);
  });

  afterEach(() => {
    hydrateDataAdapter(null);
  });

  it("retrieves all indexed timeline event records", () => {
    const events = dataAdapter.getTimelineEvents();
    expect(events.length).toBe(30);
  });

  it("verifies exact item counts across 2023, 2024, 2025, and 2026 mandate years", () => {
    const events2023 = dataAdapter.getTimelineEvents({ year: "2023" });
    const events2024 = dataAdapter.getTimelineEvents({ year: "2024" });
    const events2025 = dataAdapter.getTimelineEvents({ year: "2025" });
    const events2026 = dataAdapter.getTimelineEvents({ year: "2026" });

    expect(events2023.length).toBe(7);
    expect(events2024.length).toBe(12);
    expect(events2025.length).toBe(7);
    expect(events2026.length).toBe(4);

    const totalCalculated = events2023.length + events2024.length + events2025.length + events2026.length;
    expect(totalCalculated).toBe(30);
    expect(dataAdapter.getTimelineEvents().length).toBe(totalCalculated);
  });

  it("ensures EVERY SINGLE timeline item has an immutable ID and a dedicated timeline event route", () => {
    const events = dataAdapter.getTimelineEvents();
    expect(events.length).toBe(30);
    events.forEach((ev) => {
      expect(ev.id).toBeDefined();
      expect(ev.slug).toBeDefined();
      expect(ev.routePath).toMatch(/^\/timeline\/[a-zA-Z0-9_-]+$/);
    });
  });

  it("ensures every timeline event resolves with getTimelineEventByIdOrSlug()", () => {
    const events = dataAdapter.getTimelineEvents();
    events.forEach((ev) => {
      const byId = dataAdapter.getTimelineEventByIdOrSlug(ev.id);
      expect(byId).toBeDefined();
      expect(byId?.id).toBe(ev.id);

      const bySlug = dataAdapter.getTimelineEventByIdOrSlug(ev.slug);
      expect(bySlug).toBeDefined();
      expect(bySlug?.id).toBe(ev.id);
    });
  });
});

describe("Administration Timeline Full-Card Clickability & Navigation", () => {
  beforeEach(() => {
    hydrateDataAdapter(testPublicSnapshot);
  });

  afterEach(() => {
    hydrateDataAdapter(null);
  });

  it("renders Policy Timeline page, methodology banner, and year scrubbers", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>,
      ["/timeline"]
    );

    expect(screen.getByText("Policy & Reform Implementation Timeline")).toBeInTheDocument();
    expect(screen.getByText("6-Stage Policy Implementation Methodology")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Mandate Years" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2023" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2024" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2025" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026" })).toBeInTheDocument();
  });

  it("renders full-card clickable milestone cards in stream view", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>,
      ["/timeline"]
    );

    // Verify all 30 milestone cards are rendered as accessible button interaction surfaces
    const cards = screen.getAllByRole("button", { name: /Open timeline event dossier:/i });
    expect(cards.length).toBe(30);

    // Verify presence of event intelligence dossier action markers
    const dossierActions = screen.getAllByText("Inspect Event Intelligence Dossier");
    expect(dossierActions.length).toBe(30);
  });

  it("renders separate secondary links for associated canonical records without nested conflicts", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>,
      ["/timeline"]
    );

    const associatedLinks = screen.getAllByRole("link", { name: /Explore Associated/i });
    expect(associatedLinks.length).toBeGreaterThan(0);

    associatedLinks.forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).toMatch(/^\/(achievements|projects|policies|programmes)\/[a-zA-Z0-9_-]+$/);
    });
  });

  it("renders dedicated event dossier links in table view mode", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>,
      ["/timeline"]
    );

    const tableButton = screen.getByTitle("Compact Research Table View");
    fireEvent.click(tableButton);

    const inspectLinks = screen.getAllByRole("link", { name: "Inspect" });
    expect(inspectLinks.length).toBe(30);
    inspectLinks.forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).toMatch(/^\/timeline\/[a-zA-Z0-9_-]+$/);
    });
  });
});
