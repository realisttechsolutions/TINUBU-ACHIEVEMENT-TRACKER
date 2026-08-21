'use client';

import React, { useState } from "react";
import { useParams, Link, useNavigate } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import AchievementCard from "@/components/achievements/AchievementCard";
import { dataAdapter } from "@/adapters/dataAdapter";
import { 
  ArrowLeft, 
  Layers, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Download, 
  FileSpreadsheet, 
  Award,
  Users,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const SectorDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"achievements" | "projects" | "policies" | "programmes">("achievements");

  const sector = dataAdapter.getSectorBySlug(slug || "");

  if (!sector) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gov-navy dark:text-white">Sector Not Found</h2>
        <p className="text-sm text-gov-slate max-w-md">
          The requested sector could not be located in the 15 canonical research sectors.
        </p>
        <Button onClick={() => navigate("/sectors")} className="bg-gov-navy text-white rounded-xl">
          Return to Sectors Directory
        </Button>
      </div>
    );
  }

  const sectorAchievements = dataAdapter.getAchievements({ sectorId: sector.id });
  const sectorProjects = dataAdapter.getProjects(sector.id);
  const sectorPolicies = dataAdapter.getPolicies(sector.id);
  const sectorProgrammes = dataAdapter.getProgrammes(sector.id);

  const handleExportSectorData = () => {
    dataAdapter.exportToCsv(
      sectorAchievements.map(a => ({
        id: a.id,
        title: a.title,
        status: a.statusLabel,
        lead_mda: a.leadMda,
        date: a.date,
        summary: a.summary
      })),
      `${sector.slug}_achievements_dataset`
    );
  };

  return (
    <>
      <PageHead
        title={`${sector.publicLabel} | President Tinubu Achievement Tracker`}
        description={sector.summary}
        keywords={`${sector.name}, Nigeria reforms, Tinubu administration, ${sector.parentPublicGroupLabel}`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/sectors"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Sectors</span>
            </Link>

            <Button
              onClick={handleExportSectorData}
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-gov-gold" />
              <span>Download Sector Dataset (CSV)</span>
            </Button>
          </div>

          {/* Sector Hero Header Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gov-navy text-white border border-gov-gold/30 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>{sector.parentPublicGroupLabel}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  {sector.publicLabel}
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  {sector.description}
                </p>
              </div>

              {/* Highlight Stat Pill */}
              <div className="p-5 rounded-2xl bg-gov-darkSurface border border-gov-gold/40 space-y-1 shrink-0 md:min-w-[240px]">
                <div className="text-[10px] uppercase font-bold text-gov-gold">
                  {sector.highlightStat.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {sector.highlightStat.value}
                </div>
                <div className="text-xs text-gov-emerald font-semibold">
                  {sector.highlightStat.subtext}
                </div>
              </div>
            </div>

            {/* Strategic Objectives & Lead Institutions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-white/10 text-xs">
              <div className="lg:col-span-8 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gov-gold">
                  Key Strategic Objectives
                </div>
                <ul className="space-y-1.5">
                  {sector.keyObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-200">
                      <span className="text-gov-emerald font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gov-gold">
                  Lead Regulators & MDAs
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sector.leadInstitutions.map((inst, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-gray-200 text-[11px] font-medium border border-white/10">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Initiatives Tab Bar */}
          <div className="flex items-center gap-2 border-b border-gov-border pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("achievements")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === "achievements"
                  ? "bg-gov-navy text-gov-gold shadow-sm"
                  : "bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-gov-navy border border-gov-border"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Achievements ({sectorAchievements.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === "projects"
                  ? "bg-gov-navy text-gov-gold shadow-sm"
                  : "bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-gov-navy border border-gov-border"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Capital Projects ({sectorProjects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("policies")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === "policies"
                  ? "bg-gov-navy text-gov-gold shadow-sm"
                  : "bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-gov-navy border border-gov-border"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Policies & Acts ({sectorPolicies.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("programmes")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === "programmes"
                  ? "bg-gov-navy text-gov-gold shadow-sm"
                  : "bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-gov-navy border border-gov-border"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Social Schemes ({sectorProgrammes.length})</span>
            </button>
          </div>

          {/* Active Tab Content Stream */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectorAchievements.map((item) => (
                <AchievementCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectorProjects.map((p) => (
                <div key={p.id} className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={p.status} size="sm" />
                    <span className="text-xs font-bold text-gov-emerald tabular-nums">
                      {p.progressPercentage}% Complete
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gov-slate">{p.summary}</p>
                </div>
              ))}
              {sectorProjects.length === 0 && (
                <div className="col-span-2 p-8 text-center text-xs text-gov-slate bg-white dark:bg-gov-darkSurface rounded-2xl border">
                  No capital physical projects indexed in this sector yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "policies" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectorPolicies.map((pol) => (
                <div key={pol.id} className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={pol.status} size="sm" />
                    <span className="text-xs font-mono text-gov-gold">{pol.gazetteNumber || "Enacted"}</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
                    {pol.title}
                  </h3>
                  <p className="text-xs text-gov-slate">{pol.summary}</p>
                </div>
              ))}
              {sectorPolicies.length === 0 && (
                <div className="col-span-2 p-8 text-center text-xs text-gov-slate bg-white dark:bg-gov-darkSurface rounded-2xl border">
                  No statutory policies indexed in this sector yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "programmes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectorProgrammes.map((prg) => (
                <div key={prg.id} className="p-6 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={prg.status} size="sm" />
                    <span className="text-xs font-bold text-gov-emerald">{prg.beneficiaryCountFormatted}</span>
                  </div>
                  <h3 className="text-base font-bold font-display text-gov-navy dark:text-white">
                    {prg.title}
                  </h3>
                  <p className="text-xs text-gov-slate">{prg.summary}</p>
                </div>
              ))}
              {sectorProgrammes.length === 0 && (
                <div className="col-span-2 p-8 text-center text-xs text-gov-slate bg-white dark:bg-gov-darkSurface rounded-2xl border">
                  No social intervention schemes indexed in this sector yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SectorDetail;
