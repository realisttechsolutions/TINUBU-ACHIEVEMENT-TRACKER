'use client';
import React from "react";
import PageHead from "@/components/SEO/PageHead";
import { websiteSchema, organizationSchema } from "@/utils/structuredData";

// Modular 11-Section Narrative Flow Components
import HomeHero from "@/components/home/HomeHero";
import HomeTrustRail from "@/components/home/HomeTrustRail";
import NationalProgressOverview from "@/components/home/NationalProgressOverview";
import FeaturedAchievements from "@/components/home/FeaturedAchievements";
import SectorExplorer from "@/components/home/SectorExplorer";
import NationalImpactPreview from "@/components/home/NationalImpactPreview";
import PolicyImpactTimeline from "@/components/home/PolicyImpactTimeline";
import EvidenceDataStory from "@/components/home/EvidenceDataStory";
import LatestUpdates from "@/components/home/LatestUpdates";
import MethodologyTrustSection from "@/components/home/MethodologyTrustSection";
import ReportsResearchCTA from "@/components/home/ReportsResearchCTA";

const Index: React.FC = () => {
  const structuredData = [websiteSchema, organizationSchema];

  return (
    <>
      <PageHead
        title="President Tinubu Achievement Tracker (PTAT) | Official Evidence-Backed Records (2023–2026)"
        description="Explore policies, projects, reforms and measurable outcomes under President Bola Ahmed Tinubu's administration through sector-based data, timelines and cited evidence."
        keywords="Nigeria progress tracker, Tinubu administration achievements, economic reforms Nigeria, infrastructure development, security improvements, social services Nigeria"
        structuredData={structuredData}
      />

      <div className="w-full">
        {/* Section 1: Presidential Hero */}
        <HomeHero />

        {/* Section 2: Trust and Update Rail */}
        <HomeTrustRail />

        {/* Section 3: National Progress at a Glance */}
        <NationalProgressOverview />

        {/* Section 4: Featured Achievement Stories */}
        <FeaturedAchievements />

        {/* Section 5: Explore Progress by Sector */}
        <SectorExplorer />

        {/* Section 6: National Impact Preview */}
        <NationalImpactPreview />

        {/* Section 7: From Policy to Impact */}
        <PolicyImpactTimeline />

        {/* Section 8: Evidence-Led Data Story */}
        <EvidenceDataStory />

        {/* Section 9: Latest Verified Updates */}
        <LatestUpdates />

        {/* Section 10: Methodology and Trust */}
        <MethodologyTrustSection />

        {/* Section 11: Reports and Research CTA */}
        <ReportsResearchCTA />
      </div>
    </>
  );
};

export default Index;
