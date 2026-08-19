'use client';

import React, { useState, useMemo } from "react";
import { Link } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import SourceBadge from "@/components/common/SourceBadge";
import DemoWatermark from "@/components/common/DemoWatermark";
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
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_SECTORS } from "@/adapters/canonicalData";

export const TimelinePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"stream" | "table">("stream");

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
        source_title: e.sourceCitation?.title || "Cited Official Record",
        source_level: e.sourceCitation?.sourceLevel || "LEVEL_1"
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
                  Connect executive announcements, cabinet approvals, gazetted laws, and physical infrastructure commissioning into an auditable historical stream.
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

          {/* 6-Stage Policy Implementation Methodology Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex items-center justify-between text-xs font-bold text-gov-navy dark:text-white">
            <span>6-Stage Policy Implementation Methodology</span>
            <span className="text-gov-emerald">May 2023 — August 2026</span>
          </div>

          {/* Year Scrubber Pills */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto p-2 bg-white dark:bg-gov-darkSurface rounded-2xl border border-gov-border shadow-sm">
            <div className="flex items-center gap-2">
              {years.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedYear === yr
                      ? "bg-gov-navy text-gov-gold shadow-sm border border-gov-gold/40"
                      : "text-gov-slate hover:text-gov-navy hover:bg-gov-canvas dark:hover:bg-white/5"
                  }`}
                >
                  {yr === "all" ? "All Mandate Years" : yr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 px-2">
              <button
                type="button"
                onClick={() => setViewMode("stream")}
                className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "stream" ? "bg-gov-navy text-gov-gold" : "text-gov-slate hover:bg-gov-canvas"
                }`}
                title="Storytelling Stream View"
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === "table" ? "bg-gov-navy text-gov-gold" : "text-gov-slate hover:bg-gov-canvas"
                }`}
                title="Compact Research Table View"
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-sm">
            <div className="sm:col-span-6 relative">
              <Search className="h-4 w-4 text-gov-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search milestone title, actor, or summary..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs text-gov-navy dark:text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Sectors</option>
                {CANONICAL_SECTORS.map(s => (
                  <option key={s.id} value={s.id}>{s.publicLabel}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Event Types</option>
                <option value="enactment">Legislative Enactment</option>
                <option value="approval">FEC Approval</option>
                <option value="operation">Operational Launch</option>
                <option value="outcome_report">Outcome Milestone</option>
              </select>
            </div>
          </div>

          {/* Timeline Display: Stream Mode */}
          {viewMode === "stream" && (
            <div className="relative border-l-2 border-gov-gold/40 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8 py-2">
              {events.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-2 h-4 w-4 rounded-full bg-gov-navy border-2 border-gov-gold group-hover:bg-gov-emerald transition-colors" />

                  <div className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/40 hover:shadow-lg transition-all space-y-3">
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
                        {event.isDemo && <DemoWatermark compact />}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gov-slate leading-relaxed">
                      {event.summary}
                    </p>

                    {/* Source Citation Badge */}
                    {event.sourceCitation && (
                      <div className="p-3 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <SourceBadge level={event.sourceCitation.sourceLevel} />
                          <span className="font-semibold text-gov-navy dark:text-white truncate max-w-sm">
                            {event.sourceCitation.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-gov-slate font-medium">
                          {event.sourceCitation.publisher}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-[11px] text-gov-slate">
                      <span>Lead Actor: <strong className="text-gov-navy dark:text-white">{event.leadActor}</strong></span>
                      {event.recordId && (
                        <Link
                          to={`/achievements`}
                          className="inline-flex items-center gap-1 font-bold text-gov-emerald hover:underline"
                        >
                          <span>Explore Associated Record</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}

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
                      <th className="p-3.5">Source Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gov-border">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-gov-canvas/60 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-gov-navy dark:text-gov-gold whitespace-nowrap">
                          {ev.eventDate}
                        </td>
                        <td className="p-3.5 font-semibold text-gov-navy dark:text-white min-w-[260px]">
                          {ev.title}
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
                          {ev.sourceCitation ? (
                            <SourceBadge level={ev.sourceCitation.sourceLevel} sourceName={ev.sourceCitation.title} />
                          ) : (
                            <span className="text-gov-slate">Official Record</span>
                          )}
                        </td>
                      </tr>
                    ))}
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
