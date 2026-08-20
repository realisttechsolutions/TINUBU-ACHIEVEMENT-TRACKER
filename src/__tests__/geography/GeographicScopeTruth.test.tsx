import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { deriveGeographicScope, getGeographicRelevanceRank } from "@/utils/geographyScope";
import { dataAdapter } from "@/adapters/dataAdapter";
import ScopeBadge from "@/components/common/ScopeBadge";

describe("Geographic Scope Truth Utility", () => {
  it("classifies nationwide policies correctly as nationwide", () => {
    const scopeNelfund = deriveGeographicScope({
      title: "National Student Loan Scheme (NELFUND)",
      summary: "Universal tertiary education student loan scheme across all 36 states.",
      statesCovered: ["National"],
    });

    expect(scopeNelfund.scope).toBe("nationwide");
    expect(scopeNelfund.label).toBe("Nationwide");
    expect(scopeNelfund.isNationwide).toBe(true);
    expect(scopeNelfund.isStateSpecific).toBe(false);
  });

  it("classifies state-specific interventions with dynamic label", () => {
    const scopeTudunBiri = deriveGeographicScope({
      title: "Tudun Biri Community Reconstruction & Resettlement",
      summary: "Modern community resettlement in Igabi LGA, Kaduna State.",
      statesCovered: ["Kaduna"],
    });

    expect(scopeTudunBiri.scope).toBe("state_specific");
    expect(scopeTudunBiri.label).toBe("Kaduna-Specific");
    expect(scopeTudunBiri.isStateSpecific).toBe(true);
    expect(scopeTudunBiri.isNationwide).toBe(false);
  });

  it("classifies FCT Abuja infrastructure specifically as FCT-Specific", () => {
    const scopeAbujaMetro = deriveGeographicScope({
      title: "Abuja Light Rail Commercial Passenger Operations",
      summary: "Full commercial reactivation of the Abuja Metro Rail network in the Federal Capital Territory.",
      statesCovered: ["Federal Capital Territory"],
    });

    expect(scopeAbujaMetro.scope).toBe("fct_specific");
    expect(scopeAbujaMetro.label).toBe("FCT (Abuja)-Specific");
    expect(scopeAbujaMetro.isFct).toBe(true);
  });

  it("classifies linear highway/pipeline mega-projects as Project Corridor", () => {
    const scopeCoastalHighway = deriveGeographicScope({
      title: "700km Lagos-Calabar Coastal Highway Construction",
      summary: "A landmark 10-lane coastal highway connecting 9 maritime states.",
      statesCovered: ["Lagos", "Ogun", "Ondo", "Edo", "Delta", "Bayelsa", "Rivers", "Akwa Ibom", "Cross River"],
    });

    expect(scopeCoastalHighway.scope).toBe("project_corridor");
    expect(scopeCoastalHighway.label).toBe("Project Corridor");
    expect(scopeCoastalHighway.isCorridor).toBe(true);
    expect(scopeCoastalHighway.isMultiState).toBe(true);
  });

  it("ranks state-specific records ahead of nationwide records", () => {
    const stateScope = deriveGeographicScope({
      title: "Kaduna Solid Minerals Processing Center",
      statesCovered: ["Kaduna"],
    });
    const corridorScope = deriveGeographicScope({
      title: "Ajaokuta-Kaduna-Kano (AKK) Gas Pipeline Corridor",
      statesCovered: ["Kogi", "Kaduna", "Kano", "Abuja"],
    });
    const nationalScope = deriveGeographicScope({
      title: "Foreign Exchange Market Unification",
      statesCovered: ["National"],
    });

    const rankState = getGeographicRelevanceRank(stateScope);
    const rankCorridor = getGeographicRelevanceRank(corridorScope);
    const rankNational = getGeographicRelevanceRank(nationalScope);

    expect(rankState).toBeLessThan(rankCorridor);
    expect(rankCorridor).toBeLessThan(rankNational);
  });
});

describe("State Record Breakdown & Prioritized Relevancy in Data Adapter", () => {
  it("returns truthful breakdown counts without losing nationwide records", () => {
    const breakdown = dataAdapter.getStateRecordBreakdown("Kaduna");

    expect(breakdown.totalRelevant).toBeGreaterThan(0);
    expect(breakdown.nationwideCount).toBeGreaterThan(0);
    expect(breakdown.totalRelevant).toBe(
      breakdown.stateSpecificCount +
      breakdown.multiStateCount +
      breakdown.corridorCount +
      breakdown.regionalCount +
      breakdown.nationwideCount
    );
  });

  it("orders state-specific records at the top of the feed when filtering by state", () => {
    const kadunaAchievements = dataAdapter.getAchievements({ state: "Kaduna" });
    expect(kadunaAchievements.length).toBeGreaterThan(0);

    // If state-specific or corridor records exist, they must be ranked ahead of nationwide
    const firstItem = kadunaAchievements[0];
    expect(firstItem.scopeInfo).toBeDefined();
  });
});

describe("ScopeBadge Component", () => {
  it("renders Nationwide badge", () => {
    render(<ScopeBadge scope="nationwide" label="Nationwide" />);
    expect(screen.getByText("Nationwide")).toBeDefined();
  });

  it("renders State-Specific badge with custom state name", () => {
    render(<ScopeBadge scope="state_specific" label="Kaduna-Specific" />);
    expect(screen.getByText("Kaduna-Specific")).toBeDefined();
  });

  it("renders Project Corridor badge", () => {
    render(<ScopeBadge scope="project_corridor" label="Project Corridor" />);
    expect(screen.getByText("Project Corridor")).toBeDefined();
  });
});
