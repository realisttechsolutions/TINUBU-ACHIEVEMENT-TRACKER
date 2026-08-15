import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  Landmark, 
  ArrowRight, 
  Layers, 
  Award,
  ChevronRight
} from "lucide-react";
import { CANONICAL_PUBLIC_GROUPS, CANONICAL_SECTORS } from "@/adapters/canonicalData";
import { PublicNavigationGroupId } from "@/adapters/types";

export const SectorExplorer: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<PublicNavigationGroupId>("economy");

  const filteredSectors = CANONICAL_SECTORS.filter(s => s.parentPublicGroup === activeGroup);

  const getGroupIcon = (groupId: string) => {
    switch (groupId) {
      case "economy": return <TrendingUp className="h-4 w-4" />;
      case "security": return <ShieldCheck className="h-4 w-4" />;
      case "infrastructure": return <Building2 className="h-4 w-4" />;
      case "social_services": return <HeartPulse className="h-4 w-4" />;
      case "governance": return <Landmark className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-16 bg-gov-canvas dark:bg-gov-darkSurface/50 border-b border-gov-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5" />
              <span>Hierarchical Research Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gov-navy dark:text-white font-display">
              Explore 15 Canonical Sectors
            </h2>
            <p className="text-sm text-gov-slate leading-relaxed">
              Research is organized into 15 foundational sectors under 5 public navigation groups, enabling granular tracking of policies, capital projects, and verified outcomes.
            </p>
          </div>

          <Link
            to="/sectors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gov-emerald hover:text-emerald-700 transition-colors shrink-0"
          >
            <span>View All Sectors</span>
            <ArrowRight className="h-4 w-4 text-gov-gold" />
          </Link>
        </div>

        {/* 5 Public Navigation Group Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gov-border scrollbar-none">
          {CANONICAL_PUBLIC_GROUPS.map((group) => {
            const isSelected = activeGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroup(group.id as PublicNavigationGroupId)}
                className={`px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-gov-navy text-white shadow-md border border-gov-gold/40"
                    : "bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-gov-navy hover:bg-white/80 border border-gov-border"
                }`}
              >
                <span className={isSelected ? "text-gov-gold" : "text-gov-slate"}>
                  {getGroupIcon(group.id)}
                </span>
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSectors.map((sector) => (
            <div
              key={sector.id}
              className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Sector Badge & Counts */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gov-gold uppercase tracking-wider bg-gov-gold/10 px-2.5 py-0.5 rounded-full">
                    {sector.parentPublicGroupLabel.split('&')[0]}
                  </span>
                  <span className="text-xs font-semibold text-gov-slate">
                    {sector.achievementCount} Records
                  </span>
                </div>

                {/* Sector Title */}
                <h3 className="text-lg font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors leading-snug">
                  {sector.publicLabel}
                </h3>

                {/* Sector Summary */}
                <p className="text-xs text-gov-slate leading-relaxed line-clamp-3">
                  {sector.summary}
                </p>
              </div>

              {/* Highlight Metric Box */}
              <div className="pt-3 border-t border-gov-border/60 space-y-3">
                <div className="p-3 rounded-xl bg-gov-canvas dark:bg-white/5 space-y-0.5">
                  <div className="text-[11px] text-gov-slate font-medium">
                    {sector.highlightStat.label}
                  </div>
                  <div className="text-base font-extrabold text-gov-navy dark:text-white tabular-nums">
                    {sector.highlightStat.value}
                  </div>
                  <div className="text-[10px] text-gov-emerald font-semibold">
                    {sector.highlightStat.subtext}
                  </div>
                </div>

                <Link
                  to={`/sectors/${sector.slug}`}
                  className="flex items-center justify-between text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors pt-1"
                >
                  <span>Explore Sector Intelligence</span>
                  <ChevronRight className="h-4 w-4 text-gov-gold group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectorExplorer;
