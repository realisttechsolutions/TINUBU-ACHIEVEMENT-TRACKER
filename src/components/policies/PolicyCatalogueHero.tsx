import React from "react";
import HeroSection from "@/components/ui/hero-section";

interface PolicyCatalogueHeroProps {
  totalPoliciesCount: number;
}

export const PolicyCatalogueHero: React.FC<PolicyCatalogueHeroProps> = ({
  totalPoliciesCount,
}) => {
  return (
    <HeroSection
      title="Policy & Reform Intelligence Directory"
      subtitle="Searchable legal gazette directory of executive orders, statutory acts of parliament, fiscal reforms, and administrative directives driving Nigeria's transformation."
      action={{ text: "Explore National Policy Stream", href: "/timeline" }}
      backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
      highlightStats={[
        { value: `${totalPoliciesCount}`, label: "Indexed Major Policies" },
        { value: "100%", label: "Gazette Verified" },
        { value: "36 + FCT", label: "National Coverage" }
      ]}
    />
  );
};

export default PolicyCatalogueHero;
