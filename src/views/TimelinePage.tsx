'use client';

import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "@/lib/navigation";
import { useNavigate } from "react-router-dom";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import SourceBadge from "@/components/common/SourceBadge";
import { dataAdapter } from "@/adapters/dataAdapter";
import { 
  Clock, 
  Search, 
  Calendar, 
  LayoutList, 
  Table, 
  ArrowRight, 
  FileSpreadsheet, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Filter,
  ExternalLink,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS } from "@/adapters/canonicalData";

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedYear, setSelectedYear] = useState<string>(searchParams.get("year") || "all");
  const [selectedSector, setSelectedSector] = useState<string>(searchParams.get("sector") || "all");
  const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "all");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState<"stream" | "table">("stream");

  const handleYearChange = (yr: string) => {
    setSelectedYear(yr);
    const p: Record<string, string> = {};
    if (yr !== "all") p.year = yr;
    if (selectedSector !== "all") p.sector = selectedSector;
    if (selectedType !== "all") p.type = selectedType;
    if (searchQuery) p.q = searchQuery;
    setSearchParams(p, { replace: true });
  };

  const handleSectorChange = (sec: string) => {
    setSelectedSector(sec);
    const p: Record<string, string> = {};
    if (selectedYear !== "all") p.year = selectedYear;
    if (sec !== "all") p.sector = sec;
    if (selectedType !== "all") p.type = selectedType;
    if (searchQuery) p.q = searchQuery;
    setSearchParams(p, { replace: true });
  };

  const handleTypeChange = (typ: string) => {
    setSelectedType(typ);
    const p: Record<string, string> = {};
    if (selectedYear !== "all") p.year = selectedYear;
    if (selectedSector !== "all") p.sector = selectedSector;
    if (typ !== "all") p.type = typ;
    if (searchQuery) p.q = searchQuery;
    setSearchParams(p, { replace: true });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    const p: Record<string, string> = {};
    if (selectedYear !== "all") p.year = selectedYear;
    if (selectedSector !== "all") p.sector = selectedSector;
    if (selectedType !== "all") p.type = selectedType;
    if (q.trim()) p.q = q;
    setSearchParams(p, { replace: true });
  };

  const events = useMemo(() => {
    return dataAdapter.getTimelineEvents({
      year: selectedYear,
      sectorId: selectedSector,
      eventType: selectedType,
      searchQuery: searchQuery
    });
  }, [selectedYear, selectedSector, selectedType, searchQuery]);

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      events.map(e => ({
        event_id: e.id,
        date: e.eventDate,
        title: e.title,
        type: e.eventTypeLabel,
        sector: e.sectorName,
        lead_actor: e.leadActor,
        summary: e.summary,
        dossier_route: e.routePath || `/timeline/${e.slug || e.id}`,
        associated_record: e.associatedRecordTitle || "None",
        source_title: e.sourceCitation?.title || (e.primarySources && e.primarySources[0]?.name) || "Official Statutory Record"
      })),
      "tinubu_administration_timeline_export"
    );
  };

  const years = ["all", "2023", "2024", "2025", "2026"];

  return (
    <>
      <PageHead
        title="Policy & Reform Implementation Timeline | President Tinubu Achievement Tracker"
        description="Chronological event stream tracking policy decisions, legislative enactments, project contracts, and verified delivery outcomes (29 May 2023 – August 2026)."
        keywords="Nigeria timeline, Tinubu administration milestones, policy history Nigeria, Electricity Act 2023, NELFUND timeline"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Chronological Velocity • 29 May 2023 — August 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  Policy & Reform Implementation Timeline
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Connect executive announcements, cabinet approvals, gazetted laws, and physical infrastructure commissioning into an auditable historical stream. Click any milestone card to open its dedicated event intelligence dossier.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={handleExportCsv}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-sm"
                >
                  <FileSpreadsheet className="h-4 w-4 text-gov-gold" />
                  <span>Export Timeline (CSV)</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Methodology Banner */}
          <div className="bg-white dark:bg-gov-darkSurface rounded-2xl p-6 border border-gov-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gov-emerald" />
                <h2 className="text-sm sm:text-base font-bold font-display text-gov-navy dark:text-white">
                  6-Stage Policy Implementation Methodology
                </h2>
              </div>
              <span className="text-xs text-gov-slate hidden sm:inline">
                Standardized Governance Lifecycle
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { stage: "Announcement", desc: "Executive Intent & Public Declarations", code: "01" },
                { stage: "Approval", desc: "FEC Sanctions & Statutory Enactments", code: "02" },
                { stage: "Appropriation", desc: "Budget Allocation & Warrant Release", code: "03" },
                { stage: "Implementation", desc: "Procurement, Paving & Physical Site Work", code: "04" },
                { stage: "Operational", desc: "Commissioning & Public Service Activation", code: "05" },
                { stage: "Impact", desc: "Verified Beneficiaries & Multilateral Audits", code: "06" },
              ].map((s) => (
                <div 
                  key={s.code}
                  className="p-3 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gov-gold">
                    <span>STAGE {s.code}</span>
                  </div>
                  <div className="font-bold text-xs text-gov-navy dark:text-white">
                    {s.stage}
                  </div>
                  <div className="text-[10px] text-gov-slate leading-snug">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mandate Year Scrubbers */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gov-slate mr-2 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gov-gold" />
                  <span>Mandate Year:</span>
                </span>
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => handleYearChange(yr)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedYear === yr
                        ? "bg-gov-navy text-gov-gold shadow-md scale-105 border border-gov-gold/40"
                        : "bg-white dark:bg-gov-darkSurface text-gov-navy dark:text-gray-300 border border-gov-border hover:border-gov-gold/40"
                    }`}
                  >
                    {yr === "all" ? "All Mandate Years" : yr}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 self-end sm:self-auto bg-white dark:bg-gov-darkSurface p-1 rounded-xl border border-gov-border shadow-sm">
                <button
                  onClick={() => setViewMode("stream")}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === "stream"
                      ? "bg-gov-navy text-white shadow-sm"
                      : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
                  }`}
                  title="Chronological Milestone Stream View"
                >
                  <LayoutList className="h-4 w-4" />
                  <span className="hidden sm:inline">Stream View</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    viewMode === "table"
                      ? "bg-gov-navy text-white shadow-sm"
                      : "text-gov-slate hover:text-gov-navy dark:hover:text-white"
                  }`}
                  title="Compact Research Table View"
                >
                  <Table className="h-4 w-4" />
                  <span className="hidden sm:inline">Table View</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm">
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search milestone titles, actors, summaries, or keywords..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border text-xs focus:outline-none focus:ring-2 focus:ring-gov-gold text-gov-navy dark:text-white"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={selectedSector}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border text-xs text-gov-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-gold"
                >
                  <option value="all">All Sectors ({CANONICAL_SECTORS.length})</option>
                  {CANONICAL_SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border text-xs text-gov-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-gold"
                >
                  <option value="all">All Event Types</option>
                  <option value="announcement">Executive Announcement</option>
                  <option value="enactment">Legislative Enactment</option>
                  <option value="approval">FEC Approval</option>
                  <option value="operation">Operational Launch</option>
                  <option value="outcome_report">Outcome Milestone</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline Display: Stream Mode */}
          {viewMode === "stream" && (
            <div className="relative border-l-2 border-gov-gold/40 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8 py-2">
              {events.map((event) => {
                const eventDossierUrl = event.routePath || `/timeline/${event.slug || event.id}`;
                const associatedRecordUrl = event.associatedRecordSlug 
                  ? (event.associatedRecordType === 'project' ? `/projects/${event.associatedRecordSlug}` : event.associatedRecordType === 'policy' ? `/policies/${event.associatedRecordSlug}` : event.associatedRecordType === 'programme' ? `/programmes/${event.associatedRecordSlug}` : `/achievements/${event.associatedRecordSlug}`)
                  : null;

                return (
                  <div key={event.id} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-4 h-4 w-4 rounded-full bg-gov-navy border-2 border-gov-gold group-hover:bg-gov-emerald transition-colors" />

                    {/* ENTIRE CARD IS A PRIMARY INTERACTION TARGET */}
                    <div 
                      onClick={() => navigate(eventDossierUrl)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(eventDossierUrl);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open timeline event dossier: ${event.title}`}
                      className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-4 relative group/card focus:outline-none focus:ring-2 focus:ring-gov-gold focus:ring-offset-2"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black font-mono text-gov-navy dark:text-gov-gold tabular-nums">
                            {event.eventDate}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-gov-gold bg-gov-navy px-2.5 py-0.5 rounded-full">
                            {event.sectorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gov-emerald">
                            {event.eventTypeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white group-hover/card:text-gov-emerald transition-colors leading-snug">
                        {event.title}
                      </h3>

                      {/* Executive Summary */}
                      <p className="text-xs sm:text-sm text-gov-slate leading-relaxed">
                        {event.summary}
                      </p>

                      {/* Source Citation Badge */}
                      {(event.sourceCitation || (event.primarySources && event.primarySources[0])) && (
                        <div className="p-3 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <SourceBadge level={event.sourceCitation?.sourceLevel || (event.primarySources && event.primarySources[0]?.sourceLevel) || "LEVEL_1"} />
                            <span className="font-semibold text-gov-navy dark:text-white truncate max-w-sm">
                              {event.sourceCitation?.title || (event.primarySources && event.primarySources[0]?.name) || "Statutory Official Record"}
                            </span>
                          </div>
                          <span className="text-[11px] text-gov-slate font-medium">
                            {event.sourceCitation?.publisher || (event.primarySources && event.primarySources[0]?.publisher) || "Federal Republic of Nigeria"}
                          </span>
                        </div>
                      )}

                      {/* Associated Canonical Record Linkage (Optional Secondary Action) */}
                      {associatedRecordUrl && (
                        <div className="pt-2 border-t border-gov-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-gov-slate text-[11px]">
                            Associated Canonical Record: <strong className="text-gov-navy dark:text-white font-medium">{event.associatedRecordTitle || 'Official Record'}</strong>
                          </span>
                          <Link
                            to={associatedRecordUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold text-gov-navy dark:text-gov-gold font-bold text-xs transition-colors hover:bg-gov-gold/10"
                            title="Open associated canonical record dossier"
                          >
                            <span>Explore Associated {event.associatedRecordType === 'project' ? 'Project' : event.associatedRecordType === 'policy' ? 'Policy' : event.associatedRecordType === 'programme' ? 'Programme' : 'Achievement'}</span>
                            <ExternalLink className="h-3 w-3 text-gov-gold" />
                          </Link>
                        </div>
                      )}

                      {/* Card Footer: Lead Actor & Direct Dossier Action */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gov-slate border-t border-gov-border/40">
                        <span>Lead Actor: <strong className="text-gov-navy dark:text-white">{event.leadActor}</strong></span>
                        <div className="inline-flex items-center gap-1.5 font-bold text-gov-emerald group-hover/card:translate-x-1 transition-transform">
                          <span>Inspect Event Intelligence Dossier</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {events.length === 0 && (
                <div className="p-12 text-center text-xs text-gov-slate bg-white dark:bg-gov-darkSurface rounded-2xl border">
                  No timeline events found matching the active year, sector, or keyword filters.
                </div>
              )}
            </div>
          )}

          {/* Timeline Display: Research Table Mode */}
          {viewMode === "table" && (
            <div className="rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm overflow-hidden w-full min-w-0 max-w-full">
              <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full text-left text-xs text-gov-navy dark:text-gray-200">
                  <thead className="bg-gov-navy text-white text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Milestone Event</th>
                      <th className="p-3.5">Sector</th>
                      <th className="p-3.5">Event Type</th>
                      <th className="p-3.5">Lead Actor</th>
                      <th className="p-3.5">Associated Record</th>
                      <th className="p-3.5 text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gov-border">
                    {events.map((ev) => {
                      const eventDossierUrl = ev.routePath || `/timeline/${ev.slug || ev.id}`;

                      return (
                        <tr 
                          key={ev.id} 
                          onClick={() => navigate(eventDossierUrl)}
                          className="hover:bg-gov-canvas/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <td className="p-3.5 font-mono font-bold text-gov-navy dark:text-gov-gold whitespace-nowrap">
                            {ev.eventDate}
                          </td>
                          <td className="p-3.5 font-semibold text-gov-navy dark:text-white min-w-[260px]">
                            <Link
                              to={eventDossierUrl}
                              className="hover:text-gov-emerald hover:underline transition-colors block"
                            >
                              {ev.title}
                            </Link>
                          </td>
                          <td className="p-3.5 whitespace-nowrap text-gov-slate">
                            {ev.sectorName}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                              {ev.eventTypeLabel}
                            </span>
                          </td>
                          <td className="p-3.5 font-medium whitespace-nowrap">
                            {ev.leadActor}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {ev.associatedRecordSlug ? (
                              <Link
                                to={`/achievements/${ev.associatedRecordSlug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald underline"
                              >
                                {ev.associatedRecordTitle ? ev.associatedRecordTitle.slice(0, 24) + '...' : 'Canonical'}
                              </Link>
                            ) : (
                              <span className="text-gov-slate">Milestone</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <Link
                              to={eventDossierUrl}
                              className="inline-flex items-center gap-1 text-xs font-bold text-gov-emerald hover:underline"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimelinePage;
