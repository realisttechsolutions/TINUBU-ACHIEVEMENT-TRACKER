import React from "react";
import { Grid } from "lucide-react";
import SectorExplorerCard from "./SectorExplorerCard";
import { sectorSummaries } from "@/data/home/homepage.config";

export const SectorExplorer: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-1 max-w-2xl border-b border-gov-border/60 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
            <Grid className="h-4 w-4 text-gov-gold" />
            <span>Priority Portfolios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
            Explore Progress by Sector
          </h2>
          <p className="text-sm text-gov-slate">
            Follow reforms, projects and measurable outcomes across the administration’s major areas of national development.
          </p>
        </div>

        {/* 4 Sector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectorSummaries.map((sector) => (
            <SectorExplorerCard key={sector.id} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectorExplorer;
