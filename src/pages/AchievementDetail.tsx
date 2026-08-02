import React from "react";
import { useParams, Link } from "react-router-dom";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import DataClassificationBadge from "@/components/common/DataClassificationBadge";
import SourceBadge from "@/components/common/SourceBadge";
import AchievementShareBar from "@/components/achievements/AchievementShareBar";
import AchievementMilestoneTimeline from "@/components/achievements/AchievementMilestoneTimeline";
import AchievementSourcesCard from "@/components/achievements/AchievementSourcesCard";
import AchievementCard from "@/components/achievements/AchievementCard";
import { achievementsData } from "@/data/achievements/achievements.data";
import { ChevronRight, ArrowLeft, Building2, MapPin, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AchievementDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const achievement = achievementsData.find((item) => item.slug === slug);

  if (!achievement) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-bold font-display text-gov-navy">
          Achievement Record Not Found
        </h2>
        <p className="text-xs text-gov-slate max-w-md">
          The requested achievement record slug "{slug}" could not be resolved or is currently under editorial review.
        </p>
        <Button asChild className="bg-gov-navy text-gov-gold hover:bg-gov-emerald">
          <Link to="/achievements">Return to Achievement Catalogue</Link>
        </Button>
      </div>
    );
  }

  const relatedAchievements = achievementsData.filter(
    (item) =>
      item.slug !== achievement.slug &&
      (item.sector === achievement.sector || achievement.relatedAchievementSlugs?.includes(item.slug))
  ).slice(0, 2);

  return (
    <>
      <PageHead
        title={`${achievement.title} | Tinubu Achievement Tracker`}
        description={achievement.summary}
        keywords={`${achievement.title}, ${achievement.sector}, ${achievement.leadMinistryOrAgency}, Nigeria achievement`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Bar */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gov-slate">
            <Link to="/" className="hover:text-gov-navy">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/achievements" className="hover:text-gov-navy">Achievements</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-bold text-gov-navy dark:text-white truncate max-w-xs sm:max-w-md">
              {achievement.shortTitle || achievement.title}
            </span>
          </nav>

          {/* Presidential Header Banner */}
          <div className="bg-gov-navy text-white rounded-2xl p-6 sm:p-10 border border-gov-gold/30 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={achievement.status} size="sm" />
                <DataClassificationBadge classification={achievement.classification} size="sm" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gov-gold bg-white/10 px-3 py-1 rounded">
                {achievement.sector} Sector
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight text-white">
                {achievement.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal max-w-4xl">
                {achievement.summary}
              </p>
            </div>

            {/* Key Result Highlight Box */}
            <div className="p-4 rounded-xl bg-gov-darkSurface border border-gov-gold/40 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-gov-gold shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-gov-gold uppercase tracking-wider block">
                  Reported Impact & Measurable Outcome
                </span>
                <p className="text-white font-medium leading-relaxed">
                  {achievement.impactOutcome}
                </p>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Narrative, Timeline, Metrics, Sources */}
            <div className="lg:col-span-8 space-y-8">
              {/* Detailed Narrative */}
              <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg font-bold font-display text-gov-navy dark:text-white border-b border-gov-border/60 pb-3">
                  Implementation Summary & Technical Context
                </h2>
                <p className="text-sm text-gov-slate leading-relaxed whitespace-pre-line">
                  {achievement.fullDescription}
                </p>
              </div>

              {/* Key Metrics Breakdown Grid */}
              {achievement.keyMetrics && achievement.keyMetrics.length > 0 && (
                <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold font-display text-gov-navy dark:text-white border-b border-gov-border/60 pb-3">
                    Performance Metrics & Target Verification
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {achievement.keyMetrics.map((metric, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/40 space-y-1">
                        <span className="text-[10px] text-gov-slate uppercase font-bold block">{metric.label}</span>
                        <span className="text-base font-extrabold text-gov-navy dark:text-white font-display tabular-nums block">
                          {metric.value}
                        </span>
                        {metric.unit && (
                          <span className="text-[10px] text-gov-emerald font-semibold block">{metric.unit}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Implementation Milestone Timeline */}
              <AchievementMilestoneTimeline milestones={achievement.milestones} />

              {/* Supporting Sources Card */}
              <AchievementSourcesCard
                sources={achievement.sources}
                verificationDate={achievement.verificationDate}
              />

              {/* Social Sharing Bar */}
              <AchievementShareBar
                title={achievement.title}
                url={`/achievements/${achievement.slug}`}
              />
            </div>

            {/* Right Column: Metadata Sidebar & Related Items */}
            <div className="lg:col-span-4 space-y-6">
              {/* Metadata Sidebar Card */}
              <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-3 py-1.5 rounded text-center">
                  Record Metadata
                </h3>

                <div className="space-y-3.5 text-xs text-gov-slate divide-y divide-gov-border/60">
                  <div className="pt-2 flex justify-between items-start gap-2">
                    <span className="font-semibold text-gov-navy dark:text-white inline-flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-gov-gold shrink-0" />
                      Lead Ministry:
                    </span>
                    <span className="text-right font-medium">{achievement.leadMinistryOrAgency}</span>
                  </div>

                  <div className="pt-2 flex justify-between items-start gap-2">
                    <span className="font-semibold text-gov-navy dark:text-white inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gov-gold shrink-0" />
                      Geopolitical Scope:
                    </span>
                    <span className="text-right font-medium">{achievement.geopoliticalZone || "National"}</span>
                  </div>

                  <div className="pt-2 flex justify-between items-start gap-2">
                    <span className="font-semibold text-gov-navy dark:text-white inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gov-gold shrink-0" />
                      Verification Date:
                    </span>
                    <span className="text-right font-medium text-gov-emerald font-bold">{achievement.verificationDate}</span>
                  </div>

                  {achievement.startDate && (
                    <div className="pt-2 flex justify-between items-start gap-2">
                      <span className="font-semibold text-gov-navy dark:text-white">Start Date:</span>
                      <span className="text-right font-medium">{achievement.startDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Achievements */}
              {relatedAchievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold font-display text-gov-navy dark:text-white">
                    Related Sector Achievements
                  </h3>
                  <div className="space-y-4">
                    {relatedAchievements.map((item) => (
                      <AchievementCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementDetail;
