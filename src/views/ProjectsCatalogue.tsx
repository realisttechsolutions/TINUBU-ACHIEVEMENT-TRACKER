'use client';

import React, { useState } from "react";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import DemoWatermark from "@/components/common/DemoWatermark";
import { dataAdapter } from "@/adapters/dataAdapter";
import { Building2, MapPin, Calendar, HardHat, FileSpreadsheet, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS } from "@/adapters/canonicalData";

export const ProjectsCatalogue: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const projects = dataAdapter.getProjects(selectedSector).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.contractor?.toLowerCase().includes(q);
  });

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      projects.map(p => ({
        id: p.id,
        title: p.title,
        sector: p.sectorName,
        executing_agency: p.executingAgency,
        status: p.statusLabel,
        progress_percentage: p.progressPercentage,
        contractor: p.contractor,
        states: p.statesCovered.join("; "),
        contract_value: p.contractValue
      })),
      "tinubu_capital_projects_export"
    );
  };

  return (
    <>
      <PageHead
        title="Capital Projects Catalogue | Tinubu Achievement Tracker"
        description="Verified inventory of major capital engineering, transport corridors, highways, rail links, power plants, and housing estates under President Bola Ahmed Tinubu's administration."
        keywords="Nigeria capital projects, Lagos Calabar Coastal Highway, Sokoto Badagry Highway, Karsana housing, national infrastructure"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Building2 className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Physical Capital Infrastructure â€¢ 2023 â€” 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  National Capital Projects Catalogue
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Track the construction, contractor mobilization, progress milestones, and verified delivery across national highways, rail links, ports, and housing cities.
                </p>
              </div>

              <Button
                onClick={handleExportCsv}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                <span>Export Projects (CSV)</span>
              </Button>
            </div>
          </div>

          {/* Search & Sector Filters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, contractor, or corridor..."
              className="w-full sm:w-96 h-10 px-3.5 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs sm:text-sm text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full sm:w-64 h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Infrastructure Sectors</option>
              {CANONICAL_SECTORS.map(s => (
                <option key={s.id} value={s.id}>{s.publicLabel}</option>
              ))}
            </select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                id={proj.slug}
                className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={proj.status} size="sm" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded">
                        {proj.sectorName.split(' ')[0]}
                      </span>
                    </div>
                    {proj.isDemo && <DemoWatermark compact />}
                  </div>

                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-gov-slate leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Progress Percentage Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gov-slate">Execution Progress</span>
                      <span className="text-gov-navy dark:text-gov-gold font-bold tabular-nums">
                        {proj.progressPercentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gov-canvas dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gov-emerald transition-all duration-500 rounded-full"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Contractor & Value Info */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    {proj.contractor && (
                      <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-white/5 space-y-0.5">
                        <div className="text-[10px] text-gov-slate font-bold uppercase">Contractor</div>
                        <div className="text-xs font-semibold text-gov-navy dark:text-white truncate">
                          {proj.contractor}
                        </div>
                      </div>
                    )}
                    {proj.contractValue && (
                      <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-white/5 space-y-0.5">
                        <div className="text-[10px] text-gov-slate font-bold uppercase">Contract Value</div>
                        <div className="text-xs font-extrabold text-gov-emerald truncate">
                          {proj.contractValue}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-border/60 flex items-center justify-between text-[11px] text-gov-slate">
                  <span>MDA: <strong className="text-gov-navy dark:text-white">{proj.executingAgency}</strong></span>
                  <span>States: {proj.statesCovered.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsCatalogue;
