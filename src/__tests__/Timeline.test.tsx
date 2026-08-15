import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import TimelinePage from "@/views/TimelinePage";
import { 
  getAllTimelineEvents, 
  getTimelineStageSummaries, 
  filterTimelineEvents 
} from "@/services/timelineService";

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[]) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe("Policy Timeline Data Architecture", () => {
  it("retrieves all indexed timeline event records", () => {
    const events = getAllTimelineEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  it("aggregates events across all 6 canonical implementation stages", () => {
    const stageSummaries = getTimelineStageSummaries();
    expect(stageSummaries.length).toBe(6);
    expect(stageSummaries.some((s) => s.stage === "announcement")).toBe(true);
    expect(stageSummaries.some((s) => s.stage === "approval")).toBe(true);
    expect(stageSummaries.some((s) => s.stage === "operational")).toBe(true);
  });

  it("filters timeline events by stage and sector category", () => {
    const filteredByStage = filterTimelineEvents({ stage: "operational" });
    expect(filteredByStage.every((e) => e.stage === "operational")).toBe(true);

    const filteredByCategory = filterTimelineEvents({ category: "Economic Reform" });
    expect(filteredByCategory.every((e) => e.category === "Economic Reform")).toBe(true);
  });
});

describe("Timeline Page Component", () => {
  it("renders Policy Timeline page and hero title", () => {
    renderWithProviders(
      <Routes>
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>,
      ["/timeline"]
    );

    expect(screen.getByText("Policy & Reform Implementation Timeline")).toBeInTheDocument();
    expect(screen.getByText("6-Stage Policy Implementation Methodology")).toBeInTheDocument();
  });
});
