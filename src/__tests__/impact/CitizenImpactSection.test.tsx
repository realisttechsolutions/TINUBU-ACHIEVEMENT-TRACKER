import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CitizenImpactSection from "@/components/impact/CitizenImpactSection";
import { CitizenImpactViewModel } from "@/adapters/types";

describe("CitizenImpactSection Component", () => {
  it("renders null when impact is undefined or null (no empty placeholders)", () => {
    const { container: c1 } = render(<CitizenImpactSection impact={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<CitizenImpactSection impact={null} />);
    expect(c2.firstChild).toBeNull();
  });

  it("renders null when summary is empty or whitespace only", () => {
    const emptyImpact: CitizenImpactViewModel = {
      summary: "   ",
    };
    const { container } = render(<CitizenImpactSection impact={emptyImpact} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders core summary and heading when valid summary is provided", () => {
    const impact: CitizenImpactViewModel = {
      summary: "Direct tuition assistance and living allowances distributed directly to Nigerian tertiary students.",
    };
    render(<CitizenImpactSection impact={impact} />);

    expect(screen.getByRole("heading", { level: 2, name: /What This Means for Nigerians/i })).toBeDefined();
    expect(screen.getByText(/Direct tuition assistance and living allowances/i)).toBeDefined();
    expect(screen.getByText(/Citizen Impact Foundation/i)).toBeDefined();
  });

  it("renders all optional structured subsections when provided", () => {
    const fullImpact: CitizenImpactViewModel = {
      summary: "Affordable credit access for civil servants and private sector workers without collateral hurdles.",
      significance: "Reduces dependence on predatory informal lending while stimulating domestic manufacturing demand.",
      beneficiaryGroups: ["Civil Servants", "Working Families", "Artisans", "SMEs"],
      practicalExample: "A teacher can purchase locally assembled electronics with transparent monthly payroll deductions at single-digit rates.",
      importantContext: "Initial phase covers federal workforce before nationwide phased rollout.",
      impactNature: "observed_outcome",
    };

    render(<CitizenImpactSection impact={fullImpact} />);

    // Section headings & contents
    expect(screen.getByText(/Why It Matters/i)).toBeDefined();
    expect(screen.getByText(/Reduces dependence on predatory informal lending/i)).toBeDefined();

    expect(screen.getByText(/Who It Affects \/ Target Beneficiaries/i)).toBeDefined();
    expect(screen.getByText("Civil Servants")).toBeDefined();
    expect(screen.getByText("Working Families")).toBeDefined();
    expect(screen.getByText("Artisans")).toBeDefined();
    expect(screen.getByText("SMEs")).toBeDefined();

    expect(screen.getByText(/Everyday Practical Example/i)).toBeDefined();
    expect(screen.getByText(/A teacher can purchase locally assembled electronics/i)).toBeDefined();

    expect(screen.getByText(/Important Policy Context/i)).toBeDefined();
    expect(screen.getByText(/Initial phase covers federal workforce/i)).toBeDefined();

    // Impact nature badge
    expect(screen.getByText(/Observed Citizen Outcome/i)).toBeDefined();

    // Evidence disclaimer
    expect(screen.getByText(/Canonical primary sources, verified claims, and official agency locators are documented in the Evidence section below./i)).toBeDefined();
  });

  it("renders appropriate badge for different impact natures", () => {
    const impactPolicy: CitizenImpactViewModel = {
      summary: "Fiscal incentives for deepwater gas investments.",
      impactNature: "intended_benefit",
    };
    const { rerender } = render(<CitizenImpactSection impact={impactPolicy} />);
    expect(screen.getByText(/Intended Policy Benefit/i)).toBeDefined();

    rerender(<CitizenImpactSection impact={{ ...impactPolicy, impactNature: "expected_effect" }} />);
    expect(screen.getByText(/Expected Economic Impact/i)).toBeDefined();

    rerender(<CitizenImpactSection impact={{ ...impactPolicy, impactNature: "implementation_dependent" }} />);
    expect(screen.getByText(/Implementation-Dependent Effect/i)).toBeDefined();
  });
});
