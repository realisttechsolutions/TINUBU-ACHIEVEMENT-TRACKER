'use client';

import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import DataClassificationBadge from "@/components/common/DataClassificationBadge";
import SourceBadge from "@/components/common/SourceBadge";
import ScopeBadge from "@/components/common/ScopeBadge";
import CitizenImpactSection from "@/components/impact/CitizenImpactSection";
import { dataAdapter } from "@/adapters/dataAdapter";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Download,
  FileText,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Banknote,
  Users,
  ExternalLink,
  Layers,
  Copy,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  Briefcase,
  Compass,
  FileCode2,
  ChevronRight,
  Award,
  BookOpen,
  Activity,
  Milestone,
  CheckCircle,
  HelpCircle,
  ExternalLink as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AchievementViewModel, TimelineEventViewModel } from "@/adapters/types";

export const AchievementDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const achievement = useMemo(() => {
    return dataAdapter.getAchievementBySlug(slug || "");
  }, [slug]);

  const adjacent = useMemo(() => {
    if (!slug) return { prev: null, next: null };
    return dataAdapter.getAdjacentAchievements(slug);
  }, [slug]);

  const relatedAchievements = useMemo(() => {
    if (!achievement) return [];
    return dataAdapter.getRelatedAchievements(achievement, 3);
  }, [achievement]);

  const achievementTimelineEvents = useMemo(() => {
    if (!achievement) return [];
    return dataAdapter.getTimelineEventsForAchievement(achievement.slug || achievement.id);
  }, [achievement]);

  if (!achievement) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-4 px-4 bg-gov-canvas dark:bg-gov-navy/10 font-sans">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-white/5 border border-amber-300 text-amber-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold font-display text-gov-navy dark:text-white">
          Achievement Record Not Found
        </h2>
        <p className="text-xs sm:text-sm text-gov-slate max-w-md text-center leading-relaxed">
          The requested achievement record slug (<code className="font-mono text-gov-navy dark:text-gov-gold">{slug}</code>) could not be located in the canonical PTAT repository.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={() => navigate("/timeline")}
            variant="outline"
            className="border-gov-border text-gov-navy dark:text-white font-bold text-xs"
          >
            Go to Administration Timeline
          </Button>
          <Button
            onClick={() => navigate("/achievements")}
            className="bg-gov-navy hover:bg-gov-navy/90 text-gov-gold border border-gov-gold/40 font-bold text-xs"
          >
            Explore Achievements Catalogue
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadBrief = () => {
    dataAdapter.exportToTextSummary(achievement);
  };

  const handleDownloadJson = () => {
    dataAdapter.exportToJson(achievement, `${achievement.slug}_dossier`);
  };

  // Status progression stages
  const statusProgression = [
    { key: "proposed", label: "Proposed" },
    { key: "approved", label: "Approved / Enacted" },
    { key: "funding_released", label: "Funding Released" },
    { key: "implementation_ongoing", label: "Execution" },
    { key: "operational", label: "Operational Delivery" },
    { key: "outcome_reported", label: "Verified Outcome" }
  ];

  const getStageIndex = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("outcome")) return 5;
    if (s.includes("operational") || s.includes("completed")) return 4;
    if (s.includes("ongoing") || s.includes("execution")) return 3;
    if (s.includes("fund") || s.includes("released")) return 2;
    if (s.includes("approv") || s.includes("enact")) return 1;
    return 0;
  };

  const currentStage = getStageIndex(achievement.status);
  const mandateYear = achievement.date ? achievement.date.slice(0, 4) : "2024";

  // Helper to format state slugs
  const getStateSlug = (stateName: string): string => {
    const normalized = stateName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized === 'fct' || normalized === 'abuja' || normalized === 'fctabuja') return 'fct-abuja';
    return stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <>
      <PageHead
        title={`${achievement.title} | Executive Achievement Dossier | President Tinubu Achievement Tracker`}
        description={achievement.summary}
        keywords={`Nigeria, ${achievement.sectorName}, ${achievement.leadMda}, President Bola Ahmed Tinubu, achievement dossier, verified facts, evidence-based`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Top Breadcrumb & Executive Actions Bar */}
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
                to={`/timeline?year=${mandateYear}`}
                className="hover:text-gov-emerald transition-colors font-mono"
              >
                {mandateYear} Milestones
              </Link>
              <span>/</span>
              <span className="text-gov-navy dark:text-white font-medium truncate max-w-[240px] sm:max-w-xs">
                {achievement.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border hover:border-gov-gold/40 shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-gov-emerald" /> : <Copy className="h-3.5 w-3.5 text-gov-slate" />}
                <span>{copied ? "Link Copied" : "Share / Copy Link"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadBrief}
                className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border hover:border-gov-gold/40 shadow-sm"
              >
                <FileText className="h-3.5 w-3.5 text-gov-gold" />
                <span>Download Brief (TXT)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadJson}
                className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border hover:border-gov-gold/40 shadow-sm"
              >
                <FileCode2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>JSON Record</span>
              </Button>
            </div>
          </div>

          {/* Module A: HERO / RECORD IDENTITY */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-md space-y-6 relative overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute -right-8 -bottom-8 p-6 opacity-5 pointer-events-none">
              <Award className="h-72 w-72 text-gov-navy dark:text-gov-gold" />
            </div>

            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border/60 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={achievement.status} size="md" />
                <ScopeBadge scopeInfo={achievement.scopeInfo} statesCovered={achievement.statesCovered} size="md" />
                <DataClassificationBadge type="valueNature" value={achievement.dataValueNature} size="md" />
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-gov-navy text-gov-gold border border-gov-gold/40">
                  Mandate Year {mandateYear}
                </span>
              </div>

              <Link
                to={`/sectors/${achievement.sectorId}`}
                className="text-xs font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-3.5 py-1.5 rounded-full hover:opacity-90 transition-opacity border border-gov-gold/30 shadow-sm"
              >
                {achievement.sectorName}
              </Link>
            </div>

            {/* Title & Plain Language Story */}
            <div className="space-y-3 relative z-10">
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-emerald flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Executive Achievement Intelligence Dossier • Canonical ID: {achievement.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gov-navy dark:text-white leading-tight">
                {achievement.title}
              </h1>

              {/* Module B: EXECUTIVE SUMMARY */}
              <div className="p-5 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border/80 space-y-2">
                <span className="text-[11px] uppercase font-bold text-gov-gold tracking-wider block">
                  Executive Brief • What Was Delivered & Why It Matters
                </span>
                <p className="text-sm sm:text-base text-gov-navy dark:text-gray-200 leading-relaxed font-normal">
                  {achievement.summary}
                </p>
              </div>
            </div>

            {/* Key Facts / Core Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gov-navy dark:text-gov-gold" />
                  <span>Lead Agency / MDA</span>
                </div>
                <div className="text-xs font-bold text-gov-navy dark:text-white truncate">
                  {achievement.leadMda}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Geographic Scope</span>
                </div>
                <div className="text-xs font-bold text-gov-navy dark:text-white truncate">
                  {achievement.statesCovered.slice(0, 3).join(", ")}{achievement.statesCovered.length > 3 ? ` +${achievement.statesCovered.length - 3}` : ''}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gov-slate" />
                  <span>Date / Precision</span>
                </div>
                <div className="text-xs font-bold text-gov-navy dark:text-white font-mono">
                  {achievement.date} ({achievement.datePrecision})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gov-gold" />
                  <span>Verification Status</span>
                </div>
                <div className="text-xs font-bold text-gov-emerald capitalize">
                  {achievement.verificationStatus?.replace(/_/g, " ") || "Source Confirmed"}
                </div>
              </div>
            </div>

            {/* Implementation Lifecycle Stepper */}
            <div className="pt-4 border-t border-gov-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gov-navy dark:text-white">
                <span className="uppercase tracking-wider">6-Stage Implementation Lifecycle Progression</span>
                <span className="text-gov-emerald font-mono">{statusProgression[currentStage]?.label}</span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {statusProgression.map((stage, index) => {
                  const isDone = index <= currentStage;
                  const isCurrent = index === currentStage;
                  return (
                    <div key={stage.key} className="space-y-1.5 text-center">
                      <div
                        className={`h-2.5 rounded-full transition-colors ${
                          isDone
                            ? "bg-gov-emerald"
                            : "bg-gray-200 dark:bg-white/10"
                        } ${isCurrent ? "ring-2 ring-gov-gold ring-offset-1 dark:ring-offset-gov-darkSurface" : ""}`}
                      />
                      <span className={`text-[10px] block leading-tight ${isCurrent ? "font-bold text-gov-navy dark:text-gov-gold" : isDone ? "text-gov-emerald font-medium" : "text-gov-slate"}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Module C: KEY FACTS / VERIFIED METRICS GRID */}
          {(achievement.financialMetrics?.length || achievement.beneficiaryMetrics?.length || achievement.progressPercentage !== undefined || achievement.contractor) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gov-slate uppercase tracking-wider">
                <Activity className="h-4 w-4 text-gov-gold" />
                <span>Verified Metric Indicators & Capital Quantities</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {achievement.financialMetrics?.map((fin, i) => (
                  <div
                    key={`fin-${i}`}
                    className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-2.5 hover:border-gov-gold/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-gov-slate">
                      <span className="font-bold uppercase tracking-wider text-gov-emerald flex items-center gap-1.5">
                        <Banknote className="h-4 w-4" />
                        <span>{fin.financialTypeLabel}</span>
                      </span>
                      <span className="text-[10px] bg-gov-canvas dark:bg-white/10 px-2 py-0.5 rounded font-mono">
                        {fin.nominalOrReal} • {fin.reportingPeriod}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-black font-display text-gov-navy dark:text-white tabular-nums">
                      {fin.formattedAmount}
                    </div>

                    <div className="text-xs text-gov-slate border-t border-gov-border/50 pt-2 flex items-center justify-between">
                      <span>Source: <strong>{fin.sourceInstitution}</strong></span>
                      <span className="font-mono text-[11px]">{fin.currency}</span>
                    </div>
                  </div>
                ))}

                {achievement.beneficiaryMetrics?.map((ben, i) => (
                  <div
                    key={`ben-${i}`}
                    className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-2.5 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-gov-slate">
                      <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{ben.stageLabel}</span>
                      </span>
                      <span className="text-[10px] bg-gov-canvas dark:bg-white/10 px-2 py-0.5 rounded font-mono">
                        {ben.countBasis.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-black font-display text-gov-navy dark:text-white tabular-nums">
                      {ben.formattedCount}
                    </div>

                    {ben.doubleCountingNote ? (
                      <div className="text-[11px] text-gov-slate border-t border-gov-border/50 pt-2 leading-snug">
                        {ben.doubleCountingNote}
                      </div>
                    ) : (
                      <div className="text-[11px] text-gov-slate border-t border-gov-border/50 pt-2">
                        Reporting Period: <strong>{ben.reportingPeriod}</strong>
                      </div>
                    )}
                  </div>
                ))}

                {achievement.progressPercentage !== undefined && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-gov-slate">
                      <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span>Physical Progress</span>
                      </span>
                      <span className="text-[10px] bg-gov-canvas dark:bg-white/10 px-2 py-0.5 rounded font-mono">
                        Verified Execution
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-black font-display text-gov-navy dark:text-white tabular-nums">
                      {achievement.progressPercentage}%
                    </div>

                    <div className="w-full bg-gray-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(achievement.progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {achievement.contractor && (
                  <div className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-gov-slate flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-gov-navy dark:text-gov-gold" />
                      <span>Executing Contractor</span>
                    </div>
                    <div className="text-base sm:text-lg font-bold font-display text-gov-navy dark:text-white">
                      {achievement.contractor}
                    </div>
                    <div className="text-[11px] text-gov-slate border-t border-gov-border/50 pt-2">
                      Statutory Procurement Award
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module D: FULL ACHIEVEMENT NARRATIVE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gov-border/60 pb-3">
              <BookOpen className="h-5 w-5 text-gov-gold" />
              <h2 className="text-lg sm:text-xl font-bold font-display text-gov-navy dark:text-white">
                Institutional Context & Execution Background
              </h2>
            </div>
            <div className="text-sm sm:text-base text-gov-slate leading-relaxed space-y-4">
              <p>{achievement.description}</p>
            </div>
          </div>

          {/* Module E: MILESTONES / RECORD TIMELINE (if events exist) */}
          {achievementTimelineEvents.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gov-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-gov-emerald" />
                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                    Underlying Milestones & Administration Record Timeline
                  </h3>
                </div>
                <span className="text-xs font-semibold text-gov-slate">
                  {achievementTimelineEvents.length} Milestone{achievementTimelineEvents.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="relative border-l-2 border-gov-gold/40 ml-3 sm:ml-4 space-y-6 pl-4 sm:pl-6 py-2">
                {achievementTimelineEvents.map((evt) => (
                  <div key={evt.id} className="relative group">
                    <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-gov-navy border-2 border-gov-gold" />
                    <div className="space-y-1.5 p-4 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-gov-navy dark:text-gov-gold">{evt.eventDate}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          {evt.eventTypeLabel}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gov-navy dark:text-white">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-gov-slate leading-relaxed">
                        {evt.summary}
                      </p>
                      {evt.leadActor && (
                        <div className="text-[11px] text-gov-slate pt-1">
                          Lead Actor: <strong className="text-gov-navy dark:text-white">{evt.leadActor}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module F: GEOGRAPHIC INTELLIGENCE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-gov-emerald" />
                <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                  Geographic Footprint & Sub-National Delivery
                </h3>
              </div>
              <ScopeBadge scopeInfo={achievement.scopeInfo} statesCovered={achievement.statesCovered} size="sm" />
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-gov-slate leading-relaxed">
                This achievement operates under a <strong className="text-gov-navy dark:text-white capitalize">{achievement.geographicScope.replace(/_/g, " ")}</strong> framework. Click any covered state below to explore its full state profile and local delivery portfolio:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {achievement.statesCovered.map((st) => {
                  const stateSlug = getStateSlug(st);
                  const isNational = st.toLowerCase().includes("national") || st.toLowerCase().includes("36 states") || st.toLowerCase().includes("774");

                  if (isNational) {
                    return (
                      <span
                        key={st}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gov-navy text-gov-gold border border-gov-gold/30"
                      >
                        <MapPin className="h-3.5 w-3.5 text-gov-emerald" />
                        <span>{st}</span>
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={st}
                      to={`/states/${stateSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold/50 hover:bg-gov-gold/10 text-gov-navy dark:text-white transition-all group"
                    >
                      <MapPin className="h-3.5 w-3.5 text-gov-emerald group-hover:scale-110 transition-transform" />
                      <span>{st} State</span>
                      <ChevronRight className="h-3 w-3 text-gov-slate group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Module H: CITIZEN IMPACT SECTION ("What This Means for Nigerians") */}
          <CitizenImpactSection impact={achievement.citizenImpact} />

          {/* Module J: EVIDENCE & SOURCES DOSSIER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border-2 border-gov-gold/40 shadow-lg space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-gov-emerald" />
                  <span>Statutory Provenance & Direct Primary Citations</span>
                </div>
                <h3 className="text-xl font-bold font-display text-gov-navy dark:text-white">
                  Atomic Evidence Claims & Verified Sources
                </h3>
              </div>
              <span className="text-xs font-bold text-gov-navy dark:text-gov-gold bg-gov-canvas dark:bg-white/10 px-3 py-1 rounded-full border border-gov-border">
                {achievement.evidenceClaims.length} Documented Claim{achievement.evidenceClaims.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-4">
              {achievement.evidenceClaims.map((claim, index) => (
                <div
                  key={claim.claimId}
                  className="p-5 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border space-y-3"
                >
                  <div className="flex items-center justify-between text-xs border-b border-gov-border/60 pb-2">
                    <span className="font-bold text-gov-navy dark:text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-gov-navy text-gov-gold font-mono text-[10px]">
                        Claim {index + 1}
                      </span>
                      <span className="capitalize">{claim.claimType.replace(/_/g, " ")}</span>
                    </span>
                    <span className="text-[11px] font-mono text-gov-slate">
                      {claim.dataValueNature} • {claim.sourceOrigin.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gov-navy dark:text-gray-100 font-medium leading-relaxed">
                    "{claim.publicClaimSummary || claim.claimText}"
                  </p>

                  {/* Sources attached to this claim */}
                  <div className="pt-2 border-t border-gov-border/60 space-y-2">
                    <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider">
                      Citations & Audit Locators:
                    </div>

                    <div className="space-y-2">
                      {claim.sources.map((src) => (
                        <div
                          key={src.sourceId}
                          className="p-3.5 rounded-xl bg-white dark:bg-gov-darkSurface border border-gov-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <SourceBadge level={src.sourceLevel} />
                              <span className="font-bold text-gov-navy dark:text-white">{src.displayTitle || src.title}</span>
                            </div>
                            <div className="text-[11px] text-gov-slate">
                              Publisher: <strong>{src.publisher}</strong> • Role: {src.sourceRoleLabel}
                              {src.evidenceLocation && (
                                <span className="text-gov-emerald font-semibold ml-1">
                                  • Section: {src.evidenceLocation}
                                </span>
                              )}
                              {src.documentNumber && (
                                <span className="text-gov-gold font-mono ml-1">
                                  • Ref: {src.documentNumber}
                                </span>
                              )}
                            </div>
                          </div>

                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald hover:underline shrink-0 bg-gov-canvas dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gov-border"
                            >
                              <span>View Source Document</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module I: ASSOCIATED POLICIES & PROJECTS (if present) */}
          {((achievement.relatedPolicySlugs && achievement.relatedPolicySlugs.length > 0) || (achievement.relatedProjectSlugs && achievement.relatedProjectSlugs.length > 0)) && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gov-border/60 pb-3">
                <Layers className="h-5 w-5 text-gov-navy dark:text-gov-gold" />
                <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                  Associated Policies, Projects & Capital Programmes
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {achievement.relatedPolicySlugs?.map((polSlug) => (
                  <Link
                    key={polSlug}
                    to={`/policies/${polSlug}`}
                    className="p-4 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold/50 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-gov-gold">Enacted Policy / Legal Instrument</span>
                      <div className="font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors capitalize">
                        {polSlug.replace(/-/g, " ")}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gov-slate group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}

                {achievement.relatedProjectSlugs?.map((prjSlug) => (
                  <Link
                    key={prjSlug}
                    to={`/projects/${prjSlug}`}
                    className="p-4 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold/50 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-gov-emerald">Physical Capital Project</span>
                      <div className="font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors capitalize">
                        {prjSlug.replace(/-/g, " ")}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gov-slate group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Module K: PROVENANCE / RECORD STATUS & GOVERNANCE */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gov-slate block">Data Value Nature</span>
              <span className="font-bold text-gov-navy dark:text-white capitalize">{achievement.dataValueNature}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gov-slate block">Source Origin</span>
              <span className="font-bold text-gov-navy dark:text-white capitalize">{achievement.sourceOrigin.replace(/_/g, " ")}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gov-slate block">Publication Status</span>
              <span className="font-bold text-gov-emerald capitalize">{achievement.publicationStatus}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gov-slate block">Evidence Profile</span>
              <span className="font-bold text-gov-navy dark:text-white truncate block">{achievement.evidenceProfileLabel || achievement.evidenceProfile}</span>
            </div>
          </div>

          {/* Contradiction & Caveats Notice (if present) */}
          {achievement.contradictionNotes && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-white/5 border border-amber-300 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Reconciled Discrepancies & Methodological Notes</span>
              </div>
              <p className="leading-relaxed">{achievement.contradictionNotes}</p>
            </div>
          )}

          {/* Module L: RELATED ACHIEVEMENTS */}
          {relatedAchievements.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gov-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gov-gold" />
                  <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                    Related Verified Achievements in {achievement.sectorName}
                  </h3>
                </div>
                <Link
                  to={`/achievements?sector=${achievement.sectorId}`}
                  className="text-xs font-bold text-gov-emerald hover:underline"
                >
                  Explore All Sector Achievements →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedAchievements.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/achievements/${rel.slug || rel.id}`}
                    className="p-5 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border hover:border-gov-gold/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-gov-slate">
                        <span className="font-mono font-bold text-gov-gold">{rel.date.slice(0, 4)}</span>
                        <StatusBadge status={rel.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-gov-slate line-clamp-2 leading-relaxed">
                        {rel.summary}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald pt-2 border-t border-gov-border/40">
                      <span>Inspect Dossier</span>
                      <ArrowRight className="h-3 w-3 text-gov-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Module M: RECORD NAVIGATION BAR */}
          <div className="p-6 rounded-3xl bg-gov-navy text-white border border-gov-gold/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {adjacent.prev ? (
                <Link
                  to={`/achievements/${adjacent.prev.slug || adjacent.prev.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-gov-gold" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">← {adjacent.prev.title}</span>
                </Link>
              ) : (
                <div className="text-xs text-gray-400 italic px-2">First Achievement</div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/timeline?year=${mandateYear}`}
                className="px-4 py-2 rounded-xl bg-gov-gold text-gov-navy font-bold text-xs hover:bg-yellow-400 transition-colors shadow-sm"
              >
                Explore {mandateYear} Timeline Milestones
              </Link>
              <Link
                to="/achievements"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              >
                All Achievements
              </Link>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {adjacent.next ? (
                <Link
                  to={`/achievements/${adjacent.next.slug || adjacent.next.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{adjacent.next.title} →</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gov-gold" />
                </Link>
              ) : (
                <div className="text-xs text-gray-400 italic px-2">Latest Achievement</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AchievementDetail;
