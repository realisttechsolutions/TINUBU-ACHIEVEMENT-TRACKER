'use client';

import React from "react";
import { useParams, Link, useNavigate } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import AchievementCard from "@/components/achievements/AchievementCard";
import DemoWatermark from "@/components/common/DemoWatermark";
import { dataAdapter } from "@/adapters/dataAdapter";
import { 
  MapPin, 
  ArrowLeft, 
  Building2, 
  Users, 
  FileSpreadsheet, 
  ShieldCheck, 
  Download,
  ChevronRight,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const StateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const state = dataAdapter.getStateBySlug(slug || "");

  if (!state) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gov-navy dark:text-white">State Not Found</h2>
        <p className="text-sm text-gov-slate max-w-md">
          The requested state record could not be found in the 36 States + FCT directory.
        </p>
        <Button onClick={() => navigate("/impact-map")} className="bg-gov-navy text-white rounded-xl">
          Return to National Impact Map
        </Button>
      </div>
    );
  }

  const stateAchievements = dataAdapter.getAchievements({ state: state.name });

  const handleExportStateCsv = () => {
    dataAdapter.exportToCsv(
      stateAchievements.map(a => ({
        id: a.id,
        title: a.title,
        sector: a.sectorName,
        status: a.statusLabel,
        verification_status: a.verificationStatus,
        lead_mda: a.leadMda,
        date: a.date,
        summary: a.summary
      })),
      `${state.slug}_state_achievements_export`
    );
  };

  return (
    <>
      <PageHead
        title={`${state.name} State | Tinubu Achievement Tracker`}
        description={`Documented federal capital infrastructure projects, policy implementations, and social programmes in ${state.name} State (${state.geopoliticalZone}).`}
        keywords={`${state.name} State, Nigeria achievements, ${state.capital}, federal projects ${state.name}`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Breadcrumbs */}
          <div className="flex items-center justify-between">
            <Link
              to="/impact-map"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to National Impact Map</span>
            </Link>

            <Button
              onClick={handleExportStateCsv}
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs gap-1.5 rounded-xl border-gov-border"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-gov-gold" />
              <span>Export {state.name} Dataset (CSV)</span>
            </Button>
          </div>

          {/* Prototype Demo Banner */}
          {state.isDemo && <DemoWatermark />}

          {/* State Hero Profile Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gov-navy text-white border border-gov-gold/30 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>{state.geopoliticalZone} Geopolitical Zone</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  {state.name} State
                </h1>

                <div className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal flex flex-wrap items-center gap-2">
                  <span>State Capital:</span>
                  <span className="text-white font-bold">{state.capital}</span>
                  <span>• State Code:</span>
                  <span className="text-gov-gold font-bold">{state.code}</span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="p-4 rounded-2xl bg-gov-darkSurface border border-gov-gold/30 text-center space-y-0.5 min-w-[120px]">
                  <div className="text-2xl font-black text-gov-gold tabular-nums">
                    {state.projectCount}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium uppercase">
                    Projects Active
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gov-darkSurface border border-gov-gold/30 text-center space-y-0.5 min-w-[120px]">
                  <div className="text-2xl font-black text-gov-emerald tabular-nums">
                    {state.programmeCount}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium uppercase">
                    Social Schemes
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sectors & Highlight Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10 text-xs">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-gov-gold uppercase tracking-wider">
                  Priority Active Sectors
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {state.sectorsActive.map((sec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-gray-200">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-gov-gold uppercase tracking-wider">
                  Key Corridor / Highlight Project
                </div>
                <div className="text-sm font-semibold text-white">
                  {state.highlightProject}
                </div>
              </div>
            </div>
          </div>

          {/* Documented Achievements for State */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-gov-navy dark:text-white">
                Documented Achievements & Initiatives in {state.name} State
              </h2>
              <span className="text-xs font-semibold text-gov-slate">
                {stateAchievements.length} Record{stateAchievements.length === 1 ? "" : "s"} Indexed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateAchievements.map((item) => (
                <AchievementCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>

            {stateAchievements.length === 0 && (
              <div className="p-12 text-center text-xs text-gov-slate bg-white dark:bg-gov-darkSurface rounded-2xl border">
                State-specific standalone records are currently undergoing verification before public indexation.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StateDetail;
