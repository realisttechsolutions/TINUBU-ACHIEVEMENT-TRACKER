'use client';

import React, { useState } from "react";
import { useParams, Link, useNavigate } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import DataClassificationBadge from "@/components/common/DataClassificationBadge";
import SourceBadge from "@/components/common/SourceBadge";
import DemoWatermark from "@/components/common/DemoWatermark";
import { dataAdapter } from "@/adapters/dataAdapter";
import {
  ArrowLeft,
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
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const AchievementDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const achievement = dataAdapter.getAchievementBySlug(slug || "");

  if (!achievement) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gov-navy dark:text-white">Record Not Found</h2>
        <p className="text-sm text-gov-slate max-w-md">
          The requested achievement record could not be found or has been relocated in the canonical registry.
        </p>
        <Button onClick={() => navigate("/achievements")} className="bg-gov-navy text-white rounded-xl">
          Return to Achievements Explorer
        </Button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBrief = () => {
    dataAdapter.exportToTextSummary(achievement);
  };

  const handleDownloadJson = () => {
    dataAdapter.exportToJson(achievement, `${achievement.slug}_record`);
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
    const s = status.toLowerCase();
    if (s.includes("outcome")) return 5;
    if (s.includes("operational") || s.includes("completed")) return 4;
    if (s.includes("ongoing") || s.includes("execution")) return 3;
    if (s.includes("fund") || s.includes("released")) return 2;
    if (s.includes("approv") || s.includes("enact")) return 1;
    return 0;
  };

  const currentStage = getStageIndex(achievement.status);

  return (
    <>
      <PageHead
        title={`${achievement.title} | Tinubu Achievement Tracker`}
        description={achievement.summary}
        keywords={`${achievement.title}, ${achievement.sectorName}, Tinubu administration, Nigeria verified progress`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/achievements"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Achievements Explorer</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-gov-emerald" /> : <Copy className="h-3.5 w-3.5 text-gov-slate" />}
                <span>{copied ? "Link Copied" : "Copy Link"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadBrief}
                className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border"
              >
                <FileText className="h-3.5 w-3.5 text-gov-gold" />
                <span>Download Brief (TXT)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadJson}
                className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border"
              >
                <Download className="h-3.5 w-3.5 text-purple-600" />
                <span>JSON Record</span>
              </Button>
            </div>
          </div>

          {/* Prototype Demo Watermark Banner */}
          {achievement.isDemo && <DemoWatermark />}

          {/* Main Record Header Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-md space-y-6">
            {/* Top Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border/60 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={achievement.status} size="md" />
                <DataClassificationBadge type="verificationStatus" value={achievement.verificationStatus} size="md" />
                <DataClassificationBadge type="valueNature" value={achievement.dataValueNature} size="md" />
              </div>

              <Link
                to={`/sectors/${achievement.sectorId}`}
                className="text-xs font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-3 py-1 rounded-full hover:opacity-90 transition-opacity"
              >
                {achievement.sectorName}
              </Link>
            </div>

            {/* Title & Plain Language Story */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gov-navy dark:text-white leading-tight">
                {achievement.title}
              </h1>

              <p className="text-sm sm:text-base text-gov-slate leading-relaxed font-normal bg-gov-canvas dark:bg-white/5 p-4 rounded-2xl border border-gov-border/60">
                {achievement.summary}
              </p>
            </div>

            {/* Key Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gov-navy dark:text-gov-gold" />
                  <span>Lead Agency / MDA</span>
                </div>
                <div className="text-xs font-bold text-gov-navy dark:text-white">
                  {achievement.leadMda}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Geographic Scope</span>
                </div>
                <div className="text-xs font-bold text-gov-navy dark:text-white">
                  {achievement.statesCovered.join(", ")}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gov-canvas dark:bg-white/5 border border-gov-border/60 space-y-1">
                <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gov-slate" />
                  <span>Date / Precision</span>
                </div>
                <div className="text-xs font-bold text-gov-navy dark:text-white">
                  {achievement.date} ({achievement.datePrecision})
                </div>
              </div>
            </div>

            {/* Implementation Lifecycle Stepper */}
            <div className="pt-4 border-t border-gov-border/60 space-y-3">
              <div className="text-xs font-bold text-gov-navy dark:text-white uppercase tracking-wider">
                Implementation Lifecycle Progression
              </div>

              <div className="grid grid-cols-6 gap-2">
                {statusProgression.map((stage, index) => {
                  const isDone = index <= currentStage;
                  const isCurrent = index === currentStage;
                  return (
                    <div key={stage.key} className="space-y-1.5 text-center">
                      <div
                        className={`h-2 rounded-full transition-colors ${
                          isDone
                            ? "bg-gov-emerald"
                            : "bg-gray-200 dark:bg-white/10"
                        } ${isCurrent ? "ring-2 ring-gov-gold" : ""}`}
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

          {/* Quantified Metrics Panels (Financial & Beneficiaries) */}
          {(achievement.financialMetrics?.length || achievement.beneficiaryMetrics?.length) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {achievement.financialMetrics?.map((fin, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-2"
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

                  <div className="text-3xl font-black font-display text-gov-navy dark:text-white tabular-nums">
                    {fin.formattedAmount}
                  </div>

                  <div className="text-xs text-gov-slate">
                    Source Institution: <strong>{fin.sourceInstitution}</strong>
                  </div>
                </div>
              ))}

              {achievement.beneficiaryMetrics?.map((ben, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-gov-slate">
                    <span className="font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{ben.stageLabel}</span>
                    </span>
                    <span className="text-[10px] bg-gov-canvas dark:bg-white/10 px-2 py-0.5 rounded font-mono">
                      {ben.countBasis}
                    </span>
                  </div>

                  <div className="text-3xl font-black font-display text-gov-navy dark:text-white tabular-nums">
                    {ben.formattedCount}
                  </div>

                  {ben.doubleCountingNote && (
                    <div className="text-[11px] text-gov-slate leading-snug">
                      {ben.doubleCountingNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Detailed Narrative Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border border-gov-border shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-display text-gov-navy dark:text-white">
              Institutional Context & Execution Background
            </h2>
            <div className="text-sm text-gov-slate leading-relaxed space-y-4">
              <p>{achievement.description}</p>
            </div>
          </div>

          {/* Atomic Claims & Deep Evidence Citations */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gov-darkSurface border-2 border-gov-gold/40 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-gov-border pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-gov-emerald" />
                  <span>Atomic Evidence Citations</span>
                </div>
                <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                  Verified Claims & Primary Source Documents
                </h3>
              </div>
              <span className="text-xs font-semibold text-gov-slate">
                {achievement.evidenceClaims.length} Claim{achievement.evidenceClaims.length === 1 ? "" : "s"} Documented
              </span>
            </div>

            <div className="space-y-4">
              {achievement.evidenceClaims.map((claim, index) => (
                <div
                  key={claim.claimId}
                  className="p-5 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gov-navy dark:text-white">
                      Claim {index + 1} ({claim.claimType})
                    </span>
                    <DataClassificationBadge type="verificationStatus" value={claim.verificationStatus} size="sm" />
                  </div>

                  <p className="text-xs sm:text-sm text-gov-navy dark:text-gray-200 font-medium leading-relaxed">
                    "{claim.publicClaimSummary || claim.claimText}"
                  </p>

                  {/* Sources attached to this claim */}
                  <div className="pt-2 border-t border-gov-border/60 space-y-2">
                    <div className="text-[11px] font-bold text-gov-slate uppercase tracking-wider">
                      Citations & Locators:
                    </div>

                    <div className="space-y-2">
                      {claim.sources.map((src) => (
                        <div
                          key={src.sourceId}
                          className="p-3 rounded-xl bg-white dark:bg-gov-darkSurface border border-gov-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
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
                                  • Locator: {src.evidenceLocation}
                                </span>
                              )}
                              {src.documentNumber && (
                                <span className="text-gov-gold font-mono ml-1">
                                  • Doc: {src.documentNumber}
                                </span>
                              )}
                            </div>
                          </div>

                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-gov-emerald hover:underline shrink-0"
                            >
                              <span>View Source Document</span>
                              <ExternalLink className="h-3 w-3" />
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

          {/* Contradiction & Caveats Notice (if present) */}
          {achievement.contradictionNotes && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-white/5 border border-amber-300 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Reconciled Discrepancies & Methodological Notes</span>
              </div>
              <p className="leading-relaxed">{achievement.contradictionNotes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementDetail;
