import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AchievementDetail from "@/views/AchievementDetail";
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

describe("Executive Achievement Intelligence Dossier", () => {
  beforeEach(() => {
    hydrateDataAdapter(testPublicSnapshot);
  });

  afterEach(() => {
    hydrateDataAdapter(null);
  });

  it("renders the dedicated achievement dossier with complete hero and identity metadata", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    // Hero title & ID
    expect(screen.getByRole("heading", { level: 1, name: /National Student Financial Aid Scheme/i })).toBeInTheDocument();
    expect(screen.getByText(/Canonical ID: ACH-001/i)).toBeInTheDocument();

    // Sector badge link
    expect(screen.getByRole("link", { name: "Education and Human Capital" })).toBeInTheDocument();

    // Executive brief
    expect(screen.getByText(/Executive Brief • What Was Delivered & Why It Matters/i)).toBeInTheDocument();

    // Verification status
    expect(screen.getByText(/Source Confirmed/i)).toBeInTheDocument();
  });

  it("renders verified financial, beneficiary, and physical metric indicators", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    // Financial amount & Beneficiary count
    expect(screen.getByText("₦50.00 Billion")).toBeInTheDocument();
    expect(screen.getByText("350,000 Students")).toBeInTheDocument();
    expect(screen.getByText(/Biometrically verified against unique NIN and BVN/i)).toBeInTheDocument();
  });

  it("renders atomic evidence claims with source badges, locators, and gazette citations", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    expect(screen.getByText(/Statutory Provenance & Direct Primary Citations/i)).toBeInTheDocument();
    expect(screen.getByText(/Student Loans \(Access to Higher Education\) Act 2024 Official Gazette/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 2\(1\) - 6\(4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Vol\. 111, No\. 42/i)).toBeInTheDocument();
  });

  it("renders the 6-stage policy implementation lifecycle progression stepper", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    expect(screen.getByText(/6-Stage Implementation Lifecycle Progression/i)).toBeInTheDocument();
    const deliveryElements = screen.getAllByText("Operational Delivery");
    expect(deliveryElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the Citizen Impact section ('What This Means for Nigerians')", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    expect(screen.getByText(/What This Means for Nigerians/i)).toBeInTheDocument();
  });

  it("renders associated policy/project links and sector-related achievements", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    expect(screen.getByText(/Associated Policies, Projects & Capital Programmes/i)).toBeInTheDocument();
    expect(screen.getByText(/student loans enactment act 2024/i)).toBeInTheDocument();
  });

  it("renders the record navigation bar with timeline and adjacent exploration links", () => {
    const slug = "nelfund-student-loan-disbursement";
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      [`/achievements/${slug}`]
    );

    expect(screen.getByRole("link", { name: /Explore 2024 Timeline Milestones/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /All Achievements/i })).toBeInTheDocument();
  });

  it("gracefully renders a 404 state when an unknown achievement slug is requested", () => {
    renderWithProviders(
      <Routes>
        <Route path="/achievements/:slug" element={<AchievementDetail />} />
      </Routes>,
      ["/achievements/unknown-nonexistent-slug"]
    );

    expect(screen.getByText("Achievement Record Not Found")).toBeInTheDocument();
    expect(screen.getByText(/The requested achievement record slug/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Go to Administration Timeline/i })).toBeInTheDocument();
  });
});
