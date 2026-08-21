import React from "react";
import HeroSection from "@/components/ui/hero-section";

interface AchievementCatalogueHeroProps {
  totalAchievementsCount: number;
}

export const AchievementCatalogueHero: React.FC<AchievementCatalogueHeroProps> = ({
  totalAchievementsCount,
}) => {
  return (
    <HeroSection
      title="National Achievement Catalogue"
      subtitle="Searchable evidence-backed catalogue documenting verified policies, infrastructure projects, economic reforms, and social intervention delivery milestones."
      action={{ text: "Explore All Achievements", href: "#catalogue-grid" }}
      backgroundImage="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
      highlightStats={[
        { value: `${totalAchievementsCount}`, label: "Published Milestones" },
        { value: "100%", label: "Gazette & Primary Source" },
        { value: "36 + FCT", label: "National Reach" }
      ]}
    />
  );
};

export default AchievementCatalogueHero;
