import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SectorsCatalogue from "@/views/SectorsCatalogue";
import SectorDetail from "@/views/SectorDetail";
import LegacySectorRedirect from "@/components/common/LegacySectorRedirect";
import { getPublicSectors, getSectorBySlug, getSectorAchievements } from "@/services/sectorService";

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[]) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe("Sector Architecture & Service Layer", () => {
  it("returns active sectors correctly from the canonical data store", () => {
    const activeSectors = getPublicSectors();
    expect(activeSectors.length).toBeGreaterThanOrEqual(4);
    
    const economy = getSectorBySlug("economy");
    expect(economy).toBeDefined();
    expect(economy?.title).toBe("Economy & Fiscal Reforms");
    expect(economy?.publicationStatus).toBe("active");
  });

  it("retrieves canonical achievements linked to a sector", () => {
    const infrastructureAchievements = getSectorAchievements("infrastructure");
    expect(infrastructureAchievements).toBeDefined();
    expect(infrastructureAchievements.length).toBeGreaterThan(0);
    expect(infrastructureAchievements[0].sector).toBe("infrastructure");
  });
});

describe("Sectors Catalogue Page Component", () => {
  it("renders sector catalogue title and active sector cards without crashing", () => {
    renderWithProviders(
      <Routes>
        <Route path="/sectors" element={<SectorsCatalogue />} />
      </Routes>,
      ["/sectors"]
    );

    expect(screen.getByText("National Sector Performance Catalogue")).toBeInTheDocument();
    expect(screen.getAllByText("Economy & Fiscal Reforms")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Security & National Stability")[0]).toBeInTheDocument();
  });
});

describe("Sector Detail Page Component", () => {
  it("renders detail dashboard for a valid sector slug", () => {
    renderWithProviders(
      <Routes>
        <Route path="/sectors/:slug" element={<SectorDetail />} />
      </Routes>,
      ["/sectors/economy"]
    );

    expect(screen.getAllByText("Economy & Fiscal Reforms")[0]).toBeInTheDocument();
    expect(screen.getByText("Gross External Reserves")).toBeInTheDocument();
  });

  it("handles non-existent sector slug gracefully with fallback message", () => {
    renderWithProviders(
      <Routes>
        <Route path="/sectors/:slug" element={<SectorDetail />} />
      </Routes>,
      ["/sectors/unknown-sector-xyz"]
    );

    expect(screen.getByText("Sector Not Found")).toBeInTheDocument();
  });
});

describe("Legacy Sector Route Migration", () => {
  it("redirects legacy /economic-reforms route to /sectors/economy", () => {
    renderWithProviders(
      <Routes>
        <Route path="/economic-reforms" element={<LegacySectorRedirect targetSlug="economy" />} />
        <Route path="/sectors/:slug" element={<SectorDetail />} />
      </Routes>,
      ["/economic-reforms"]
    );

    expect(screen.getAllByText("Economy & Fiscal Reforms")[0]).toBeInTheDocument();
  });
});
