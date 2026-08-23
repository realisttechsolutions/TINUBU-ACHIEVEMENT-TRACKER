import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  PieChart as PieChartIcon,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { SectorEngineData } from '@/types/macro.types';

interface EconomicEnginesProps {
  sectors: SectorEngineData[];
}

export const EconomicEngines: React.FC<EconomicEnginesProps> = ({ sectors }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(sectors[0]?.sectorId || '');
  const activeSector = sectors.find((s) => s.sectorId === selectedSectorId) || sectors[0];

  return (
    <section
      aria-labelledby="economic-engines-heading"
      className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2">
        <span className="p-1.5 rounded-md bg-gov-navy/10 dark:bg-gov-navy/40 text-gov-navy dark:text-gov-gold">
          <PieChartIcon className="w-4 h-4 text-gov-gold" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          REAL ECONOMY DYNAMICS
        </span>
      </div>

      <h2 id="economic-engines-heading" className="text-lg sm:text-xl font-bold text-foreground">
        Real Economic Engines (NBS GDP Breakdown)
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-3xl">
        Official sectoral output shares and year-on-year real growth rates across major GDP activity clusters based on the National Bureau of Statistics (NBS) national accounts.
      </p>

      {/* 2-Column Layout: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Sector Weights List (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          {sectors.map((sector) => {
            const isSelected = sector.sectorId === activeSector.sectorId;
            const isGrowthPositive = sector.yoyRealGrowth > 0;

            return (
              <div
                key={sector.sectorId}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedSectorId(sector.sectorId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedSectorId(sector.sectorId);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-gov-gold/50 ${
                  isSelected
                    ? 'bg-gov-canvas dark:bg-muted/60 border-gov-gold ring-1 ring-gov-gold/30 shadow-xs'
                    : 'bg-card hover:bg-muted/30 border-border/70 hover:border-border'
                }`}
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {sector.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      {sector.shareOfGDP}% of GDP
                    </span>
                  </div>

                  {/* Progress Bar of GDP Share */}
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gov-gold h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(sector.shareOfGDP * 3.5, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Growth Pill */}
                <div className="shrink-0 text-right flex items-center space-x-2">
                  <div className="text-right">
                    <span className={`inline-flex items-center text-xs font-bold font-mono ${
                      isGrowthPositive ? 'text-status-green' : 'text-rose-600'
                    }`}>
                      {isGrowthPositive ? '+' : ''}{sector.yoyRealGrowth}% YoY
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      (prev: {sector.precedingYoYGrowth}%)
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-gov-gold translate-x-0.5' : 'text-muted-foreground/50'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-muted/30 border border-border flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground">
                {activeSector.name}
              </h3>
              <span className="text-xs font-mono font-bold text-gov-gold">
                {activeSector.shareOfGDP}% Weight
              </span>
            </div>

            {/* Subsectors Tags */}
            <div className="mt-3">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1.5">
                Key Economic Subsectors
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeSector.subsectors.map((sub, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-card border border-border/60 text-foreground/90 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Growth Drivers */}
            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                Output & Growth Drivers
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeSector.driverSummary}
              </p>
            </div>

            {/* Structural Headwinds */}
            <div className="mt-3">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                Operating Headwinds & Cost Pressures
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeSector.headwindSummary}
              </p>
            </div>
          </div>

          {/* Related Policy Intervention Link */}
          {activeSector.policyInterventionSlug && (
            <div className="pt-3 border-t border-border/50">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                Related Policy Intervention
              </span>
              <Link
                href={`/policies/${activeSector.policyInterventionSlug}`}
                className="text-xs font-semibold text-gov-navy dark:text-gov-gold hover:underline flex items-center justify-between group"
              >
                <span className="line-clamp-1">{activeSector.policyInterventionTitle}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EconomicEngines;
