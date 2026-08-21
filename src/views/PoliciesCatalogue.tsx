'use client';

import React, { useState } from "react";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import { dataAdapter } from "@/adapters/dataAdapter";
import { FileText, Search, ShieldCheck, Scale, Calendar, Building2, FileSpreadsheet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS } from "@/adapters/canonicalData";
import { Link } from "@/lib/navigation";

export const PoliciesCatalogue: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const policies = dataAdapter.getPolicies(selectedSector).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.leadMinistry.toLowerCase().includes(q);
  });

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      policies.map(p => ({
        id: p.id,
        title: p.title,
        type: p.policyTypeLabel,
        sector: p.sectorName,
        lead_ministry: p.leadMinistry,
        status: p.statusLabel,
        approval_date: p.approvalDate,
        gazette_number: p.gazetteNumber || "N/A"
      })),
      "tinubu_policies_and_reforms_export"
    );
  };

  return (
    <>
      <PageHead
        title="Policy & Reform Intelligence Directory | President Tinubu Achievement Tracker"
        description="Searchable legal gazette directory of executive orders, statutory acts of parliament, and structural policy frameworks under President Bola Ahmed Tinubu's administration."
        keywords="Nigeria policies, Electricity Act 2023, Student Loans Act 2024, Pharmaceutical Executive Order, legal gazette Nigeria"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Scale className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Statutory Acts & Executive Orders • 2023 — 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Policy & Reform Intelligence Directory
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Inspect the statutory foundations of the administration's reform agenda with official gazette references, legal instruments, and enacting ministries.
                </p>
              </div>

              <Button
                onClick={handleExportCsv}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                <span>Export Policies (CSV)</span>
              </Button>
            </div>
          </div>

          {/* Canonical Policy Registry Subheading */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-gov-navy dark:text-white">
              Canonical Policy Registry
            </h2>
            <span className="text-xs text-gov-slate">
              {policies.length} Policies Indexed
            </span>
          </div>

          {/* Search & Sector Filters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policy name, act, or enacting ministry..."
              className="w-full sm:w-96 h-10 px-3.5 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs sm:text-sm text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full sm:w-64 h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Policy Sectors</option>
              {CANONICAL_SECTORS.map(s => (
                <option key={s.id} value={s.id}>{s.publicLabel}</option>
              ))}
            </select>
          </div>

          {/* Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((pol) => (
              <div
                key={pol.id}
                id={pol.slug}
                className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={pol.status} size="sm" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gov-navy bg-gov-canvas dark:bg-white/10 px-2 py-0.5 rounded border">
                        {pol.policyTypeLabel}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white leading-snug">
                    {pol.title}
                  </h3>

                  <p className="text-xs text-gov-slate leading-relaxed">
                    {pol.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-white/5 space-y-0.5">
                      <div className="text-[10px] text-gov-slate font-bold uppercase">Enacting Ministry</div>
                      <div className="text-xs font-semibold text-gov-navy dark:text-white truncate">
                        {pol.leadMinistry}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-white/5 space-y-0.5">
                      <div className="text-[10px] text-gov-slate font-bold uppercase">Gazette / Law No.</div>
                      <div className="text-xs font-mono font-bold text-gov-gold truncate">
                        {pol.gazetteNumber || "Official Instrument"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gov-slate">
                  <span>Sector: <strong className="text-gov-navy dark:text-white">{pol.sectorName}</strong></span>
                  <span>Date: {pol.approvalDate}</span>
                  <Link to={`/policies/${pol.slug}`} className="ml-auto inline-flex items-center gap-1 font-bold text-gov-emerald hover:underline">
                    View policy record <ArrowRight className="h-3.5 w-3.5" />
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

export default PoliciesCatalogue;
