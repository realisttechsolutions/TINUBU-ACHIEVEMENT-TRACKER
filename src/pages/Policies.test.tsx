import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PoliciesCatalogue from "./PoliciesCatalogue";
import PolicyDetail from "./PolicyDetail";
import { getAllPolicies, getPolicyBySlug, filterPolicies } from "@/services/policyService";

const renderWithProviders = (ui: React.ReactElement, initialEntries: string[]) => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe("Policy & Reform Data Architecture", () => {
  it("retrieves canonical policy records", () => {
    const policies = getAllPolicies();
    expect(policies.length).toBeGreaterThan(0);
  });

  it("retrieves policy by slug with legal authority reference", () => {
    const policy = getPolicyBySlug("access-to-higher-education-act");
    expect(policy).toBeDefined();
    expect(policy?.shortTitle).toBe("Student Loan Act");
    expect(policy?.policyType).toBe("legislation");
    expect(policy?.authorityReference).toContain("Official Gazette");
  });

  it("filters policies by policy type", () => {
    const legislationPolicies = filterPolicies({ type: "legislation" });
    expect(legislationPolicies.length).toBeGreaterThan(0);
    expect(legislationPolicies.every((p) => p.policyType === "legislation")).toBe(true);
  });
});

describe("Policies Catalogue Component", () => {
  it("renders Policy Catalogue hero and registry cards without crashing", () => {
    renderWithProviders(
      <Routes>
        <Route path="/policies" element={<PoliciesCatalogue />} />
      </Routes>,
      ["/policies"]
    );

    expect(screen.getByText("Policy & Reform Intelligence Directory")).toBeInTheDocument();
    expect(screen.getByText("Canonical Policy Registry")).toBeInTheDocument();
  });
});

describe("Policy Detail Component", () => {
  it("renders Policy Detail dashboard for Student Loan Act", () => {
    renderWithProviders(
      <Routes>
        <Route path="/policies/:slug" element={<PolicyDetail />} />
      </Routes>,
      ["/policies/access-to-higher-education-act"]
    );

    expect(screen.getAllByText("Access to Higher Education Act (Student Loan Law)")[0]).toBeInTheDocument();
  });

  it("handles non-existent policy slug gracefully", () => {
    renderWithProviders(
      <Routes>
        <Route path="/policies/:slug" element={<PolicyDetail />} />
      </Routes>,
      ["/policies/invalid-policy-999"]
    );

    expect(screen.getByText("Policy Record Not Found")).toBeInTheDocument();
  });
});
