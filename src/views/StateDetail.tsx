'use client';

import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "@/lib/navigation";
import PageHead from "@/components/SEO/PageHead";
import StatusBadge from "@/components/common/StatusBadge";
import ScopeBadge from "@/components/common/ScopeBadge";
import AchievementCard from "@/components/achievements/AchievementCard";
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
  Layers,
  Globe,
  Navigation,
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const StateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedScopeTab, setSelectedScopeTab] = useState<'all' | 'state_specific' | 'multi_state' | 'nationwide'>('all');

  const state = dataAdapter.getStateBySlug(slug || "");

  const breakdown = useMemo(() => {
    if (!state) {
      return {
        totalRelevant: 0,
        stateSpecificCount: 0,
        multiStateCount: 0,
        corridorCount: 0,
        nationwideCount: 0,
        regionalCount: 0,
        stateSpecificRecords: [],
        multiStateRecords: [],
        nationwideRecords: [],
      };
    }
    return dataAdapter.getStateRecordBreakdown(state.name);
  }, [state]);

  const stateAchievements = useMemo(() => {
    if (!state) return [];
    return dataAdapter.getAchievements({
      state: state.name,
      scopeType: selectedScopeTab === 'all' ? 'all' : selectedScopeTab,
    });
  }, [state, selectedScopeTab]);

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

  const handleExportStateCsv = () => {
    dataAdapter.exportToCsv(
      stateAchievements.map(a => ({
        id: a.id,
        title: a.title,
        scope: a.scopeInfo?.label || a.geographicScope,
        sector: a.sectorName,
        status: a.statusLabel,
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
        title={`${state.name} State | President Tinubu Achievement Tracker`}
        description={`Documented federal capital infrastructure projects, state-specific initiatives, and nationwide programmes relevant to ${state.name} State (${state.geopoliticalZone}).`}
        keywords={`${state.name} State, Nigeria achievements, ${state.capital}, federal projects ${state.name}`}
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Breadcrumbs & Export */}
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

                <div className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal flex flex-wrap items-center gap-3">
                  <span>State Capital: <strong className="text-white">{state.capital}</strong></span>
                  <span>•</span>
                  <span>State Code: <strong className="text-gov-gold">{state.code}</strong></span>
                  <span>•</span>
                  <span>Total Relevant Records: <strong className="text-emerald-400">{breakdown.totalRelevant}</strong></span>
                </div>
              </div>

              {/* Geographic Relevance Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
                <div className="p-3.5 rounded-2xl bg-gov-darkSurface/90 border border-emerald-500/30 text-center space-y-0.5 min-w-[105px]">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                    {breakdown.stateSpecificCount}
                  </div>
                  <div className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                    {state.name.split(' ')[0]} Specific
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gov-darkSurface/90 border border-blue-500/30 text-center space-y-0.5 min-w-[105px]">
                  <div className="text-xl sm:text-2xl font-black text-blue-400 tabular-nums">
                    {breakdown.multiStateCount + breakdown.corridorCount}
                  </div>
                  <div className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                    Corridor / Multi
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gov-darkSurface/90 border border-gov-gold/30 text-center space-y-0.5 min-w-[105px] col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-black text-gov-gold tabular-nums">
                    {breakdown.nationwideCount}
                  </div>
                  <div className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                    Nationwide
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sectors & Highlight Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10 text-xs">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-gov-gold uppercase tracking-wider">
                  Priority Active Sectors in {state.name}
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

          {/* Geographic Scope Explanation Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border flex items-start gap-3 text-xs text-gov-slate">
            <Info className="h-4 w-4 text-gov-emerald shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gov-navy dark:text-white">Geographic Scope Presentation Rule: </span>
              Achievements specifically anchored in {state.name} State appear first, followed by multi-state transport/energy corridors traversing {state.name}, and nationwide policies (e.g. NELFUND, Tax Modernization, FX Unification) that deliver universal benefits to citizens across all 36 States + FCT.
            </div>
          </div>

          {/* Scope Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gov-border pb-3">
            <button
              onClick={() => setSelectedScopeTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedScopeTab === 'all'
                  ? 'bg-gov-navy text-white shadow-sm'
                  : 'bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-gov-navy border border-gov-border'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>All Relevant Records ({breakdown.totalRelevant})</span>
            </button>

            <button
              onClick={() => setSelectedScopeTab('state_specific')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedScopeTab === 'state_specific'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-emerald-700 border border-gov-border'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              <span>{state.name}-Specific ({breakdown.stateSpecificCount})</span>
            </button>

            <button
              onClick={() => setSelectedScopeTab('multi_state')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedScopeTab === 'multi_state'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-blue-700 border border-gov-border'
              }`}
            >
              <Navigation className="h-3.5 w-3.5 text-blue-500" />
              <span>Corridors & Multi-State ({breakdown.multiStateCount + breakdown.corridorCount})</span>
            </button>

            <button
              onClick={() => setSelectedScopeTab('nationwide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedScopeTab === 'nationwide'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white dark:bg-gov-darkSurface text-gov-slate hover:text-amber-700 border border-gov-border'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Nationwide Scope ({breakdown.nationwideCount})</span>
            </button>
          </div>

          {/* Documented Achievements for State Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-gov-navy dark:text-white">
                {selectedScopeTab === 'all' && `All Records Relevant to ${state.name} State`}
                {selectedScopeTab === 'state_specific' && `${state.name}-Specific Records`}
                {selectedScopeTab === 'multi_state' && `Multi-State & Corridor Projects Involving ${state.name}`}
                {selectedScopeTab === 'nationwide' && `Nationwide Programmes Active in ${state.name}`}
              </h2>
              <span className="text-xs font-semibold text-gov-slate">
                Showing {stateAchievements.length} of {breakdown.totalRelevant} records
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateAchievements.map((item) => (
                <AchievementCard key={item.id} item={item} viewMode="grid" />
              ))}
            </div>

            {stateAchievements.length === 0 && (
              <div className="p-12 text-center text-xs text-gov-slate bg-white dark:bg-gov-darkSurface rounded-2xl border space-y-2">
                <p className="font-semibold text-sm text-gov-navy dark:text-white">
                  No records match the selected scope filter for {state.name} State.
                </p>
                <p>
                  Try selecting "All Relevant Records" to view all nationwide and corridor initiatives delivering value to {state.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StateDetail;
