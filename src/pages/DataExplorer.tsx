import React, { useState, useMemo } from "react";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import DataClassificationBadge from "@/components/common/DataClassificationBadge";
import DemoWatermark from "@/components/common/DemoWatermark";
import { dataAdapter } from "@/adapters/dataAdapter";
import { 
  Database, 
  Search, 
  Download, 
  FileSpreadsheet, 
  Code, 
  RotateCcw, 
  Copy, 
  Check, 
  Layers, 
  MapPin, 
  Filter,
  ExternalLink,
  ShieldCheck,
  Table as TableIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS, DEMO_NIGERIA_STATES } from "@/adapters/canonicalData";

export const DataExplorer: React.FC = () => {
  const [sectorFilter, setSectorFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    return dataAdapter.getAchievements({
      sectorId: sectorFilter,
      state: stateFilter,
      status: statusFilter,
      verificationStatus: verificationFilter,
      year: yearFilter,
      searchQuery: searchQuery
    });
  }, [sectorFilter, stateFilter, statusFilter, verificationFilter, yearFilter, searchQuery]);

  const handleReset = () => {
    setSectorFilter("all");
    setStateFilter("all");
    setStatusFilter("all");
    setVerificationFilter("all");
    setYearFilter("all");
    setSearchQuery("");
  };

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      results.map(r => ({
        record_id: r.id,
        title: r.title,
        sector: r.sectorName,
        group: r.publicNavigationGroupLabel,
        record_type: r.recordTypeLabel,
        status: r.statusLabel,
        data_nature: r.dataValueNature,
        source_origin: r.sourceOrigin,
        verification_status: r.verificationStatus,
        lead_mda: r.leadMda,
        states: r.statesCovered.join("; "),
        date: r.date,
        summary: r.summary
      })),
      "tinubu_data_explorer_query_export"
    );
  };

  const handleExportJson = () => {
    dataAdapter.exportToJson(results, "tinubu_data_explorer_query_export");
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHead
        title="Interactive Data Explorer | Tinubu Achievement Tracker"
        description="Query, filter, inspect, and export structured public datasets of achievements, capital projects, structural reforms, and social programmes under President Bola Ahmed Tinubu (2023 - 2026)."
        keywords="Nigeria open data, Tinubu achievements query builder, CSV download, JSON export, public dataset"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Database className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Public Research Query Engine • Contract v1.1.2</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Interactive Data Explorer
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Build custom multi-dimensional queries across all 15 canonical sectors, 36 states + FCT, and 21 implementation statuses. Export live slices directly into CSV or JSON formats for independent research and fact-checking.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  onClick={handleExportCsv}
                  variant="outline"
                  size="sm"
                  className="bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm border-none"
                >
                  <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                  <span>Download CSV</span>
                </Button>

                <Button
                  onClick={handleExportJson}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm"
                >
                  <Code className="h-4 w-4 text-purple-300" />
                  <span>Download JSON</span>
                </Button>

                <Button
                  onClick={handleCopyShareLink}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-3 rounded-xl gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="h-4 w-4 text-gov-emerald" /> : <Copy className="h-4 w-4 text-gov-slate" />}
                  <span>{copied ? "Link Copied" : "Share Query"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Dimensional Query Builder Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gov-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gov-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-gov-navy dark:text-white">
                  Multi-Dimensional Filter Builder
                </span>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Query Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              {/* Sector */}
              <div>
                <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">
                  1. Canonical Sector
                </label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-navy/20 text-xs font-semibold text-gov-navy dark:text-white cursor-pointer"
                >
                  <option value="all">All 15 Sectors</option>
                  {CANONICAL_SECTORS.map(s => (
                    <option key={s.id} value={s.id}>{s.publicLabel}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">
                  2. State / FCT
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-navy/20 text-xs font-semibold text-gov-navy dark:text-white cursor-pointer"
                >
                  <option value="all">All 36 States + FCT</option>
                  {DEMO_NIGERIA_STATES.map(st => (
                    <option key={st.slug} value={st.name}>{st.name} ({st.geopoliticalZone})</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">
                  3. Implementation Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-navy/20 text-xs font-semibold text-gov-navy dark:text-white cursor-pointer"
                >
                  <option value="all">All 21 Statuses</option>
                  <option value="operational">Operational</option>
                  <option value="implementation_ongoing">Ongoing Execution</option>
                  <option value="completed">Completed</option>
                  <option value="approved">Approved</option>
                  <option value="enacted">Enacted into Law</option>
                  <option value="funding_released">Funding Released</option>
                  <option value="outcome_reported">Outcome Reported</option>
                </select>
              </div>

              {/* Verification */}
              <div>
                <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">
                  4. Verification Tier
                </label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-navy/20 text-xs font-semibold text-gov-navy dark:text-white cursor-pointer"
                >
                  <option value="all">All Verification Tiers</option>
                  <option value="source_confirmed">Source Confirmed</option>
                  <option value="independently_corroborated">Independently Corroborated</option>
                  <option value="cross_referenced">Cross Referenced</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>

              {/* Mandate Year */}
              <div>
                <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">
                  5. Mandate Period
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-navy/20 text-xs font-semibold text-gov-navy dark:text-white cursor-pointer"
                >
                  <option value="all">All Years (2023 - 2026)</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="relative">
              <Search className="h-4 w-4 text-gov-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keywords (e.g. 'NELFUND', 'Lagos-Calabar', 'Electricity Act', 'Ministry of Finance')..."
                className="w-full h-10 pl-10 pr-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs text-gov-navy dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs">
              <TableIcon className="h-4 w-4 text-gov-gold" />
              <span className="font-bold text-gov-navy dark:text-white tabular-nums">
                {results.length}
              </span>
              <span className="text-gov-slate">
                records match active query criteria
              </span>
            </div>

            <div className="text-xs text-gov-slate">
              Showing live filtered slice • Ready for CSV/JSON download
            </div>
          </div>

          {/* Tabular Results Preview Table */}
          <div className="rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-navy dark:text-gray-200">
                <thead className="bg-gov-navy text-white text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Record ID</th>
                    <th className="p-4">Title & Plain Summary</th>
                    <th className="p-4">Sector</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Lead Agency</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {results.map((row) => (
                    <tr key={row.id} className="hover:bg-gov-canvas/60 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-gov-gold whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="p-4 min-w-[280px]">
                        <div className="font-bold text-gov-navy dark:text-white text-xs sm:text-sm">
                          {row.title}
                        </div>
                        <div className="text-[11px] text-gov-slate line-clamp-1 mt-0.5">
                          {row.summary}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded">
                          {row.sectorName.split(' ')[0]}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <DataClassificationBadge type="verificationStatus" value={row.verificationStatus} size="sm" />
                      </td>
                      <td className="p-4 text-gov-slate whitespace-nowrap">
                        {row.leadMda}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs font-bold text-gov-emerald hover:underline"
                          asChild
                        >
                          <a href={`/achievements/${row.slug}`} target="_blank" rel="noopener noreferrer">
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {results.length === 0 && (
                <div className="p-12 text-center text-xs text-gov-slate">
                  No records match your query parameters. Try widening the filters above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataExplorer;
