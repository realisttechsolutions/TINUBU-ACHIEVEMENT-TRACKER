import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ImpactMapPage from "@/views/ImpactMapPage";
import StatesCatalogue from "@/views/StatesCatalogue";
import StateDetail from "@/views/StateDetail";
import { 
  getAllStates, 
  getGeopoliticalZones, 
  getStateBySlug, 
  getStateImpactSummary 
} from "@/services/geographyService";

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[]) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe("Geographic Intelligence Data Architecture", () => {
  it("registers all 36 Nigerian States plus FCT Abuja (37 units total)", () => {
    const states = getAllStates();
    expect(states.length).toBe(37);
  });

  it("registers 6 Geopolitical Zones with assigned state codes", () => {
    const zones = getGeopoliticalZones();
    expect(zones.length).toBe(6);
  });

  it("retrieves canonical state record and state impact summary", () => {
    const lagos = getStateBySlug("lagos");
    expect(lagos).toBeDefined();
    expect(lagos?.name).toBe("Lagos State");
    expect(lagos?.capital).toBe("Ikeja");
    expect(lagos?.zone).toBe("South-West");

    const summary = getStateImpactSummary("lagos");
    expect(summary).toBeDefined();
    expect(summary?.totalPublishedRecords).toBeGreaterThan(0);
  });
});

describe("National Impact Map Page Component", () => {
  it("renders National Impact Map hero and vector map without crashing", () => {
    renderWithProviders(
      <Routes>
        <Route path="/impact-map" element={<ImpactMapPage />} />
      </Routes>,
      ["/impact-map"]
    );

    expect(screen.getByText("National Geographic Impact Map")).toBeInTheDocument();
    expect(screen.getByText("Interactive Geographic Intelligence Layer")).toBeInTheDocument();
  });
});

describe("State Catalogue Page Component", () => {
  it("renders State Catalogue and all 6 zone headers", () => {
    renderWithProviders(
      <Routes>
        <Route path="/states" element={<StatesCatalogue />} />
      </Routes>,
      ["/states"]
    );

    expect(screen.getByText("Nigeria State Performance Catalogue")).toBeInTheDocument();
    expect(screen.getAllByText("South-West Zone")[0]).toBeInTheDocument();
    expect(screen.getAllByText("North-Central Zone")[0]).toBeInTheDocument();
  });
});

describe("State Detail Page Component", () => {
  it("renders State Detail dashboard for Lagos State", () => {
    renderWithProviders(
      <Routes>
        <Route path="/states/:slug" element={<StateDetail />} />
      </Routes>,
      ["/states/lagos"]
    );

    expect(screen.getAllByText("Lagos State")[0]).toBeInTheDocument();
    expect(screen.getByText("Ikeja")).toBeInTheDocument();
  });

  it("handles non-existent state slug gracefully with fallback message", () => {
    renderWithProviders(
      <Routes>
        <Route path="/states/:slug" element={<StateDetail />} />
      </Routes>,
      ["/states/invalid-state-123"]
    );

    expect(screen.getByText("State Not Found")).toBeInTheDocument();
  });
});
