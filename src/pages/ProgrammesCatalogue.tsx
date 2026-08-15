import React, { useState } from "react";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import DemoWatermark from "@/components/common/DemoWatermark";
import { dataAdapter } from "@/adapters/dataAdapter";
import { Users, Search, ShieldCheck, Calendar, Building2, FileSpreadsheet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS } from "@/adapters/canonicalData";

export const ProgrammesCatalogue: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const programmes = dataAdapter.getProgrammes(selectedSector).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.coordinatingAgency.toLowerCase().includes(q);
  });

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      programmes.map(p => ({
        id: p.id,
        title: p.title,
        type: p.programmeTypeLabel,
        sector: p.sectorName,
        coordinating_agency: p.coordinatingAgency,
        status: p.statusLabel,
        beneficiaries: p.beneficiaryCountFormatted || "N/A",
        launch_date: p.launchDate
      })),
      "tinubu_social_programmes_export"
    );
  };

  return (
    <>
      <PageHead
        title="Social Programmes Catalogue | Tinubu Achievement Tracker"
        description="Searchable directory of student financing schemes, consumer credit platforms, youth capacity programs, and social safety nets under President Bola Ahmed Tinubu's administration."
        keywords="Nigeria social programmes, NELFUND student loans, CREDICORP credit, 3MTT tech talents, social safety nets"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Users className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Human Capital & Social Interventions • 2023 — 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  National Social Programmes Catalogue
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Explore student loans, worker credit facilities, youth tech talent fellowships, and targeted cash transfers with verified beneficiary metrics.
                </p>
              </div>

              <Button
                onClick={handleExportCsv}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                <span>Export Programmes (CSV)</span>
              </Button>
            </div>
          </div>

          {/* Search & Sector Filters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programme name, target beneficiaries, or agency..."
              className="w-full sm:w-96 h-10 px-3.5 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs sm:text-sm text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full sm:w-64 h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Social Sectors</option>
              {CANONICAL_SECTORS.map(s => (
                <option key={s.id} value={s.id}>{s.publicLabel}</option>
              ))}
            </select>
          </div>

          {/* Programmes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programmes.map((prg) => (
              <div
                key={prg.id}
                id={prg.slug}
                className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={prg.status} size="sm" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded">
                        {prg.programmeTypeLabel}
                      </span>
                    </div>
                    {prg.isDemo && <DemoWatermark compact />}
                  </div>

                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white leading-snug">
                    {prg.title}
                  </h3>

                  <p className="text-xs text-gov-slate leading-relaxed">
                    {prg.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-white/5 space-y-0.5">
                      <div className="text-[10px] text-gov-slate font-bold uppercase">Coordinating Agency</div>
                      <div className="text-xs font-semibold text-gov-navy dark:text-white truncate">
                        {prg.coordinatingAgency}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-white/5 space-y-0.5">
                      <div className="text-[10px] text-gov-slate font-bold uppercase">Beneficiary Count</div>
                      <div className="text-xs font-extrabold text-gov-emerald truncate">
                        {prg.beneficiaryCountFormatted || "Enrolling"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-border/60 flex items-center justify-between text-[11px] text-gov-slate">
                  <span>Sector: <strong className="text-gov-navy dark:text-white">{prg.sectorName}</strong></span>
                  <span>Launched: {prg.launchDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgrammesCatalogue;
