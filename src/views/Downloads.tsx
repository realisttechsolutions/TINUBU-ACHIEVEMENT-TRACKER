'use client';

import React, { useState } from "react";
import PageHead from "@/components/SEO/PageHead";
import DemoWatermark from "@/components/common/DemoWatermark";
import { dataAdapter } from "@/adapters/dataAdapter";
import { 
  Download, 
  FileSpreadsheet, 
  Code, 
  FileText, 
  ShieldCheck, 
  Database, 
  Search, 
  Filter, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS, DEMO_NIGERIA_STATES } from "@/adapters/canonicalData";

export const Downloads: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const datasets = dataAdapter.getDatasets().filter(d => {
    if (selectedCategory !== "all" && d.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDownloadCsv = (ds: any) => {
    dataAdapter.exportToCsv(
      dataAdapter.getPublicDownloadData(),
      `${ds.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_dataset`
    );
  };

  const handleDownloadJson = (ds: any) => {
    dataAdapter.exportToJson(
      {
        datasetName: ds.title,
        period: ds.periodCovered,
        recordCount: ds.recordCount,
        lastUpdated: ds.lastUpdated,
        governingContract: "TAT_RESEARCH_CONTRACT_V1_1_2",
        data: dataAdapter.getPublicDownloadData()
      },
      `${ds.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_dataset`
    );
  };

  return (
    <>
      <PageHead
        title="Download Centre | Tinubu Achievement Tracker"
        description="Download structured, machine-readable datasets (CSV, JSON, PDF) of achievements, capital projects, structural reforms, and evidence bibliographies under President Bola Ahmed Tinubu (2023 - 2026)."
        keywords="Nigeria public data download, Tinubu administration datasets, CSV export, JSON download, open government Nigeria"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                <Download className="h-3.5 w-3.5 text-gov-emerald" />
                <span>Open Data Repository • Machine-Readable Exports</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Dataset Download Centre
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                Access structured research datasets across all 15 canonical sectors, 36 states, and administration timeline events in CSV, JSON, and PDF summary formats.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              {['all', 'core', 'sector', 'state', 'timeline', 'evidence'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-gov-navy text-gov-gold shadow-sm"
                      : "bg-gov-canvas dark:bg-white/5 text-gov-slate hover:text-gov-navy"
                  }`}
                >
                  {cat === 'all' ? 'All Datasets' : cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="h-4 w-4 text-gov-slate absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dataset title..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none"
              />
            </div>
          </div>

          {/* Dataset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.map((ds) => (
              <div
                key={ds.id}
                className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2.5 py-1 rounded-md">
                      {ds.category} Dataset
                    </span>
                    <span className="text-xs font-semibold text-gov-slate">
                      {ds.recordCount} Records
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white leading-snug">
                    {ds.title}
                  </h3>

                  <p className="text-xs text-gov-slate leading-relaxed">
                    {ds.description}
                  </p>

                  <div className="p-3 rounded-xl bg-gov-canvas dark:bg-white/5 space-y-1 text-xs text-gov-slate">
                    <div>Coverage Period: <strong className="text-gov-navy dark:text-white">{ds.periodCovered}</strong></div>
                    <div>Last Audit Sync: <strong className="text-gov-emerald">{ds.lastUpdated}</strong></div>
                  </div>
                </div>

                {/* Download Buttons Bar */}
                <div className="pt-3 border-t border-gov-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ds.fileFormats.includes("CSV") && (
                      <Button
                        size="sm"
                        onClick={() => handleDownloadCsv(ds)}
                        className="bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-xs h-8 px-3 rounded-lg gap-1.5 shadow-sm"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-gov-gold" />
                        <span>CSV</span>
                      </Button>
                    )}

                    {ds.fileFormats.includes("JSON") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadJson(ds)}
                        className="border-gov-border text-gov-navy dark:text-white font-bold text-xs h-8 px-3 rounded-lg gap-1.5"
                      >
                        <Code className="h-3.5 w-3.5 text-purple-600" />
                        <span>JSON</span>
                      </Button>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-gov-slate uppercase">
                    UTF-8 • RFC-4180
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Downloads;
