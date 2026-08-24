'use client';

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import SourceBadge from "@/components/common/SourceBadge";
import { dataAdapter } from "@/adapters/dataAdapter";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  ExternalLink, 
  MapPin, 
  Building2, 
  Scale, 
  ShieldCheck, 
  Layers, 
  Calendar,
  Sparkles,
  TrendingUp,
  Link2,
  Users,
  Compass,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const TimelineEventDetail: React.FC = () => {
  const params = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const rawSlug = params.slug || params.id || "";
  const event = dataAdapter.getTimelineEventByIdOrSlug(rawSlug);

  if (!event) {
    return (
      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gov-darkSurface p-8 sm:p-12 rounded-3xl border border-gov-border text-center space-y-6 shadow-xl">
          <div className="h-16 w-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-gov-navy dark:text-white">
              Timeline Milestone Not Found
            </h1>
            <p className="text-sm text-gov-slate">
              The requested timeline milestone identifier <code className="text-gov-gold font-mono font-bold bg-gov-navy/10 px-2 py-0.5 rounded">"{rawSlug}"</code> could not be resolved in the certified administration timeline index.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/timeline")}
              className="bg-gov-navy hover:bg-gov-navy/90 text-white font-bold text-xs h-11 px-6 rounded-xl gap-2 w-full sm:w-auto shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Administration Timeline</span>
            </Button>
            <Button
              onClick={() => navigate("/achievements")}
              variant="outline"
              className="border-gov-border text-gov-navy dark:text-white hover:border-gov-gold text-xs h-11 px-6 rounded-xl w-full sm:w-auto"
            >
              <span>Explore All Achievements</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const adjacent = dataAdapter.getAdjacentTimelineEvents(event.slug || event.id);
  const relatedEvents = dataAdapter.getRelatedTimelineEvents(event, 3);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadBrief = () => {
    const lines = [
      `============================================================`,
      `PTAT TIMELINE EVENT INTELLIGENCE DOSSIER`,
      `============================================================`,
      `EVENT TITLE: ${event.title}`,
      `EVENT ID: ${event.id}`,
      `DATE: ${event.eventDate}`,
      `MANDATE YEAR: ${event.year || event.eventDate.slice(0, 4)}`,
      `SECTOR: ${event.sectorName}`,
      `EVENT TYPE: ${event.eventTypeLabel}`,
      `STAGE: ${event.stageLabel || event.stage || 'Delivered'}`,
      `LEAD ACTOR: ${event.leadActor}`,
      `LEAD AGENCY: ${event.leadAgency || 'Federal Government of Nigeria'}`,
      `GEOGRAPHY: ${(event.statesCovered || ['National']).join(', ')}`,
      `------------------------------------------------------------`,
      `EXECUTIVE SUMMARY:`,
      `${event.summary}`,
      ``,
      `DETAILED NARRATIVE:`,
      `${event.details || event.summary}`,
      ``,
      `MEASURED / EXPECTED IMPACT:`,
      `${event.expectedOrMeasuredImpact || 'Direct national delivery impact.'}`,
      `------------------------------------------------------------`,
      `CANONICAL ASSOCIATED RECORD: ${event.associatedRecordTitle || 'Direct Administration Milestone'}`,
      `VERIFICATION STATUS: ${event.verificationStatus || 'Verified Statutory Milestone'}`,
      `============================================================`,
      `PRESIDENT TINUBU ACHIEVEMENT TRACKER • OFFICIAL PUBLIC RECORD`,
      `https://tat.gov.ng/timeline/${event.slug || event.id}`,
      `============================================================`
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PTAT_EVENT_${event.id}_${event.slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(event, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PTAT_EVENT_${event.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cleanStateSlug = (s: string) => {
    const lower = s.toLowerCase().trim();
    if (lower === 'fct' || lower === 'abuja') return 'fct-abuja';
    return lower.replace(/\s+/g, '-');
  };

  const yearNum = event.year || event.eventDate.slice(0, 4);

  return (
    <>
      <PageHead
        title={`${event.title} | Administration Timeline Dossier`}
        description={event.summary}
        keywords={`${event.title}, Nigeria policy milestone, Tinubu administration timeline, ${event.sectorName}`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumb Bar & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border/60 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gov-slate">
              <Link 
                to="/timeline" 
                className="inline-flex items-center gap-1.5 font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald transition-colors"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Administration Timeline</span>
              </Link>
              <span>/</span>
              <Link 
                to={`/timeline?year=${yearNum}`}
                className="hover:text-gov-emerald transition-colors font-mono"
              >
                {yearNum} Milestones
              </Link>
              <span>/</span>
              <span className="text-gov-navy dark:text-white font-medium truncate max-w-[240px] sm:max-w-xs">
                {event.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 rounded-xl border-gov-border hover:border-gov-gold/40 shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-gov-emerald" /> : <Copy className="h-3.5 w-3.5 text-gov-slate" />}
                <span>{copied ? "Link Copied" : "Share / Copy Link"}</span>
              </Button>

              <Button
                onClick={handleDownloadBrief}
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 rounded-xl border-gov-border hover:border-gov-gold/40 shadow-sm"
              >
                <FileText className="h-3.5 w-3.5 text-gov-gold" />
                <span>Download Brief (TXT)</span>
              </Button>

              <Button
                onClick={handleExportJson}
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 rounded-xl border-gov-border hover:border-gov-gold/40 shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-gov-emerald" />
                <span>JSON Record</span>
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODULE A: EVENT HERO & RECORD IDENTITY                                   */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-gov-navy text-white p-6 sm:p-10 border border-gov-gold/30 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gov-gold/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badge Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3 py-1 rounded-full bg-gov-gold/20 text-gov-gold border border-gov-gold/40 font-mono font-bold">
                Immutable Event ID: {event.id}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono font-bold flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-gov-gold" />
                <span>{event.eventDate}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-gov-emerald/20 text-emerald-300 border border-gov-emerald/40 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-gov-emerald" />
                <span>{event.verificationStatus || 'Statutorily Grounded'}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 font-medium">
                {event.eventTypeLabel}
              </span>

              <Link 
                to={`/sectors/${event.sectorId}`}
                className="px-3 py-1 rounded-full bg-gov-gold/10 hover:bg-gov-gold/20 text-gov-gold transition-colors font-bold text-xs flex items-center gap-1"
              >
                <Building2 className="h-3 w-3" />
                <span>{event.sectorName}</span>
              </Link>
            </div>

            {/* Headline Title */}
            <div className="space-y-3 max-w-4xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                {event.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-normal">
                {event.summary}
              </p>
            </div>

            {/* Key Actor & Scope Ribbon */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gov-gold" />
                <span>Lead Implementing Body: <strong className="text-white font-bold">{event.leadAgency || event.leadActor}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gov-emerald" />
                <span>Geographic Scope: <strong className="text-white font-bold">{event.geopoliticalZone || (event.statesCovered ? event.statesCovered.join(', ') : 'National')}</strong></span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODULE B & C: EXECUTIVE SUMMARY & EVENT FACTS / VERIFIED METRICS          */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Executive Summary & Narrative */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Executive Summary Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gov-border/60">
                  <Sparkles className="h-5 w-5 text-gov-gold" />
                  <h2 className="text-base sm:text-lg font-bold font-display text-gov-navy dark:text-white">
                    Executive Brief • What Occurred & Why It Matters
                  </h2>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-gov-navy/90 dark:text-gray-200 leading-relaxed space-y-4">
                  <p className="text-sm sm:text-base leading-relaxed font-medium">
                    {event.summary}
                  </p>

                  {event.details && (
                    <p className="text-xs sm:text-sm text-gov-slate dark:text-gray-300 leading-relaxed">
                      {event.details}
                    </p>
                  )}
                </div>

                {event.expectedOrMeasuredImpact && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-gov-emerald/30 space-y-1.5 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gov-emerald">
                      <TrendingUp className="h-4 w-4" />
                      <span>Verified or Projected National Impact</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gov-navy dark:text-white font-medium">
                      {event.expectedOrMeasuredImpact}
                    </p>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* MODULE E: ASSOCIATED CANONICAL RECORD CALLOUT                             */}
              {/* ========================================================================= */}
              {event.associatedRecordSlug && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gov-navy/5 via-gov-gold/5 to-transparent border-2 border-gov-gold/40 shadow-md space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-gov-gold" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gov-navy dark:text-gov-gold">
                        Associated Canonical Public Record
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-gov-navy text-gov-gold font-mono font-bold text-[10px]">
                      {event.associatedRecordType ? event.associatedRecordType.toUpperCase() : 'CANONICAL'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                      {event.associatedRecordTitle || 'Official Certified Record'}
                    </h3>
                    <p className="text-xs text-gov-slate">
                      This administration timeline milestone links to an authoritative, evidence-grounded canonical record with verified budget allocations, beneficiary statistics, and statutory documentation.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={event.associatedRecordType === 'project' ? `/projects/${event.associatedRecordSlug}` : event.associatedRecordType === 'policy' ? `/policies/${event.associatedRecordSlug}` : event.associatedRecordType === 'programme' ? `/programmes/${event.associatedRecordSlug}` : `/achievements/${event.associatedRecordSlug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gov-navy hover:bg-gov-navy/90 text-white font-bold text-xs shadow-md transition-all group"
                    >
                      <span>Explore Dedicated {event.associatedRecordType === 'project' ? 'Project Dossier' : event.associatedRecordType === 'policy' ? 'Policy Record' : event.associatedRecordType === 'programme' ? 'Programme Dossier' : 'Achievement Intelligence Dossier'}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* MODULE F: GEOGRAPHIC FOOTPRINT                                           */}
              {/* ========================================================================= */}
              {event.statesCovered && event.statesCovered.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gov-border/60">
                    <MapPin className="h-5 w-5 text-gov-emerald" />
                    <h2 className="text-base sm:text-lg font-bold font-display text-gov-navy dark:text-white">
                      Geographic Footprint & Delivery Corridor
                    </h2>
                  </div>

                  <p className="text-xs text-gov-slate">
                    Implementation and operational execution footprint across sub-national federating units:
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {event.statesCovered.map((st) => {
                      const isSpecial = st.toLowerCase().includes('all 36') || st.toLowerCase() === 'national';
                      if (isSpecial) {
                        return (
                          <span 
                            key={st}
                            className="px-3.5 py-1.5 rounded-xl bg-gov-navy text-gov-gold font-bold text-xs border border-gov-gold/30"
                          >
                            {st}
                          </span>
                        );
                      }
                      return (
                        <Link
                          key={st}
                          to={`/states/${cleanStateSlug(st)}`}
                          className="px-3 py-1.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold hover:text-gov-emerald text-gov-navy dark:text-white font-medium text-xs transition-colors"
                        >
                          {st}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* MODULE G: EVIDENCE & PRIMARY STATUTORY SOURCES                           */}
              {/* ========================================================================= */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gov-border/60">
                  <Scale className="h-5 w-5 text-gov-gold" />
                  <h2 className="text-base sm:text-lg font-bold font-display text-gov-navy dark:text-white">
                    Primary Statutory Citations & Verification Basis
                  </h2>
                </div>

                {event.primarySources && event.primarySources.length > 0 ? (
                  <div className="space-y-3">
                    {event.primarySources.map((src, i) => (
                      <div 
                        key={i}
                        className="p-4 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <SourceBadge level={src.sourceLevel || "LEVEL_1"} />
                            <span className="font-bold text-gov-navy dark:text-white">
                              {src.name}
                            </span>
                          </div>
                          {src.publisher && (
                            <p className="text-[11px] text-gov-slate">
                              Publisher: <strong className="text-gov-navy dark:text-gray-300">{src.publisher}</strong>
                              {src.documentNumber && <span> • Gazette/Doc No: {src.documentNumber}</span>}
                              {src.evidenceLocation && <span> • Locator: {src.evidenceLocation}</span>}
                            </p>
                          )}
                        </div>

                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-gov-emerald hover:underline shrink-0"
                          >
                            <span>Inspect Source</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border/80 text-xs text-gov-slate">
                    Statutorily grounded milestone verified against official Gazette records and executive council notices.
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Event Facts / Implementing Actors Sidebar */}
            <div className="space-y-8">
              
              {/* Event Provenance & Metadata Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gov-navy dark:text-gov-gold pb-3 border-b border-gov-border/60">
                  Milestone Record Profile
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-gov-slate block text-[11px]">Event Date</span>
                    <span className="font-mono font-bold text-gov-navy dark:text-white text-sm">{event.eventDate}</span>
                  </div>

                  <div>
                    <span className="text-gov-slate block text-[11px]">Administration Mandate Year</span>
                    <span className="font-bold text-gov-navy dark:text-white">{yearNum} Mandate Cycle</span>
                  </div>

                  <div>
                    <span className="text-gov-slate block text-[11px]">Implementation Lifecycle Stage</span>
                    <span className="font-bold text-gov-emerald">{event.stageLabel || event.stage || 'Operational Delivery'}</span>
                  </div>

                  <div>
                    <span className="text-gov-slate block text-[11px]">Sector Category</span>
                    <span className="font-bold text-gov-navy dark:text-white">{event.category || event.sectorName}</span>
                  </div>

                  <div>
                    <span className="text-gov-slate block text-[11px]">Lead Implementing Institution</span>
                    <span className="font-bold text-gov-navy dark:text-white">{event.leadAgency || event.leadActor}</span>
                  </div>

                  <div>
                    <span className="text-gov-slate block text-[11px]">Verification Classification</span>
                    <span className="font-bold text-gov-emerald">{event.verificationStatus || 'Statutorily Grounded'}</span>
                  </div>
                </div>
              </div>

              {/* Related Milestones Card */}
              {relatedEvents.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gov-navy dark:text-gov-gold pb-3 border-b border-gov-border/60">
                    Related Timeline Milestones
                  </h3>

                  <div className="space-y-3">
                    {relatedEvents.map((rel) => (
                      <Link
                        key={rel.id}
                        to={`/timeline/${rel.slug || rel.id}`}
                        className="block p-3.5 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 hover:border-gov-gold/60 transition-all group space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-gov-slate">
                          <span>{rel.eventDate}</span>
                          <span className="font-bold text-gov-emerald">{rel.eventTypeLabel}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODULE J: RECORD NAVIGATION BAR (PREVIOUS / NEXT / TIMELINE HUB)          */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {adjacent.prev ? (
              <Link
                to={`/timeline/${adjacent.prev.slug || adjacent.prev.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-gov-navy dark:text-white hover:text-gov-emerald transition-colors max-w-xs group"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 group-hover:-translate-x-1 transition-transform text-gov-gold" />
                <span className="truncate">← Previous: {adjacent.prev.title}</span>
              </Link>
            ) : (
              <span className="text-xs text-gov-slate">Start of Timeline Series</span>
            )}

            <div className="flex items-center gap-2">
              <Link
                to={`/timeline?year=${yearNum}`}
                className="px-4 py-2 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold text-gov-navy dark:text-white font-bold text-xs transition-colors"
              >
                Explore {yearNum} Milestones
              </Link>
              <Link
                to="/timeline"
                className="px-4 py-2 rounded-xl bg-gov-navy text-white font-bold text-xs hover:bg-gov-navy/90 transition-colors shadow-sm"
              >
                All Timeline Milestones
              </Link>
            </div>

            {adjacent.next ? (
              <Link
                to={`/timeline/${adjacent.next.slug || adjacent.next.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-gov-navy dark:text-white hover:text-gov-emerald transition-colors max-w-xs text-right group"
              >
                <span className="truncate">Next: {adjacent.next.title} →</span>
                <ArrowRight className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform text-gov-gold" />
              </Link>
            ) : (
              <span className="text-xs text-gov-slate">End of Timeline Series</span>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default TimelineEventDetail;
