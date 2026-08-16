'use client';

import React, { useState } from "react";
import { Link } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import { 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  Landmark, 
  Layers, 
  ArrowRight, 
  Search,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_PUBLIC_GROUPS, CANONICAL_SECTORS } from "@/adapters/canonicalData";
import { dataAdapter } from "@/adapters/dataAdapter";

export const SectorsCatalogue: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sectors = CANONICAL_SECTORS.filter(s => {
    if (selectedGroup !== "all" && s.parentPublicGroup !== selectedGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.leadInstitutions.some(i => i.toLowerCase().includes(q));
    }
    return true;
  });

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      CANONICAL_SECTORS.map(s => ({
        sector_id: s.id,
        name: s.name,
        public_group: s.parentPublicGroupLabel,
        achievements_count: s.achievementCount,
        projects_count: s.projectCount,
        policies_count: s.policyCount,
        lead_institutions: s.leadInstitutions.join("; ")
      })),
      "tinubu_canonical_sectors_export"
    );
  };

  return (
    <>
      <PageHead
        title="National Sector Performance Catalogue | Tinubu Achievement Tracker"
        description="Comprehensive directory of the 15 canonical research sectors organized under 5 public navigation groups under President Bola Ahmed Tinubu's administration (2023 - 2026)."
        keywords="Nigeria sectors, economic reforms, infrastructure, agriculture, security, education, health, power, digital economy, Contract v1.1.2"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>15 Canonical Sectors • 5 Public Navigation Groups</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  National Sector Performance Catalogue
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  All documented policies, capital infrastructure developments, and verified public outcomes classified according to the Contract v1.1.2 research taxonomy.
                </p>
              </div>

              <Button
                onClick={handleExportCsv}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                <span>Export Sectors (CSV)</span>
              </Button>
            </div>
          </div>

          {/* Group Filter Tabs & Search */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedGroup("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedGroup === "all"
                    ? "bg-gov-navy text-gov-gold shadow-sm"
                    : "bg-gov-canvas dark:bg-white/5 text-gov-slate hover:text-gov-navy"
                }`}
              >
                All 15 Sectors
              </button>
              {CANONICAL_PUBLIC_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGroup(g.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedGroup === g.id
                      ? "bg-gov-navy text-gov-gold shadow-sm"
                      : "bg-gov-canvas dark:bg-white/5 text-gov-slate hover:text-gov-navy"
                  }`}
                >
                  {g.label.split('&')[0]}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="h-4 w-4 text-gov-slate absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sector or agency..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none"
              />
            </div>
          </div>

          {/* Sectors 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2.5 py-1 rounded-md">
                      {sector.parentPublicGroupLabel}
                    </span>
                    <span className="text-xs font-semibold text-gov-slate">
                      {sector.achievementCount} Achievements
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors leading-snug">
                    {sector.publicLabel}
                  </h3>

                  <p className="text-xs text-gov-slate leading-relaxed line-clamp-3">
                    {sector.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-gov-canvas dark:bg-white/5 space-y-1">
                    <div className="text-[10px] text-gov-slate font-bold uppercase">
                      {sector.highlightStat.label}
                    </div>
                    <div className="text-base font-black text-gov-navy dark:text-white tabular-nums">
                      {sector.highlightStat.value}
                    </div>
                    <div className="text-[10px] text-gov-emerald font-semibold">
                      {sector.highlightStat.subtext}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-border/60 flex items-center justify-between">
                  <div className="text-[11px] text-gov-slate">
                    {sector.projectCount} Projects • {sector.policyCount} Policies
                  </div>

                  <Link
                    to={`/sectors/${sector.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors"
                  >
                    <span>Sector Hub</span>
                    <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectorsCatalogue;
