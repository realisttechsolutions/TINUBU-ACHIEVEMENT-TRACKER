import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PageHead from "@/components/SEO/PageHead";
import AchievementFilterBar, { FilterState } from "@/components/achievements/AchievementFilterBar";
import AchievementCard from "@/components/achievements/AchievementCard";
import { dataAdapter } from "@/adapters/dataAdapter";
import { Award, ShieldCheck, Database, FileSpreadsheet, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AchievementsCatalogue: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL query parameters if present
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get("q") || "",
    publicGroup: searchParams.get("group") || "all",
    sectorId: searchParams.get("sector") || "all",
    status: searchParams.get("status") || "all",
    verificationStatus: searchParams.get("verification") || "all",
    state: searchParams.get("state") || "all",
    year: searchParams.get("year") || "all",
    sortBy: (searchParams.get("sort") as any) || "newest"
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updated };
      // Sync with URL query params
      const params: Record<string, string> = {};
      if (next.searchQuery) params.q = next.searchQuery;
      if (next.sectorId !== "all") params.sector = next.sectorId;
      if (next.status !== "all") params.status = next.status;
      if (next.state !== "all") params.state = next.state;
      if (next.year !== "all") params.year = next.year;
      if (next.sortBy !== "newest") params.sort = next.sortBy;
      setSearchParams(params, { replace: true });
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      publicGroup: "all",
      sectorId: "all",
      status: "all",
      verificationStatus: "all",
      state: "all",
      year: "all",
      sortBy: "newest"
    });
    setSearchParams({}, { replace: true });
  };

  const achievements = useMemo(() => {
    return dataAdapter.getAchievements({
      searchQuery: filters.searchQuery,
      sectorId: filters.sectorId,
      status: filters.status,
      verificationStatus: filters.verificationStatus,
      state: filters.state,
      year: filters.year,
      sortBy: filters.sortBy
    });
  }, [filters]);

  const handleExportCsv = () => {
    dataAdapter.exportToCsv(
      achievements.map((a) => ({
        id: a.id,
        title: a.title,
        sector: a.sectorName,
        group: a.publicNavigationGroupLabel,
        status: a.statusLabel,
        verification_status: a.verificationStatus,
        lead_mda: a.leadMda,
        states: a.statesCovered.join("; "),
        date: a.date,
        summary: a.summary
      })),
      "tinubu_achievements_catalogue_export"
    );
  };

  return (
    <>
      <PageHead
        title="Achievements Explorer | Tinubu Achievement Tracker"
        description="Searchable, evidence-backed repository of policies, infrastructure projects, reforms, and measurable national outcomes under President Bola Ahmed Tinubu's administration (2023 - 2026)."
        keywords="Nigeria achievement catalogue, Tinubu progress database, coastal highway, NELFUND loans, economic reforms Nigeria, 15 sectors"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-3xl p-6 sm:p-10 border border-gov-gold/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="h-64 w-64 text-gov-gold" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-gov-emerald" />
                  <span>Verified National Progress Record • 2023 — 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  National Achievements Explorer
                </h1>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                  Search and inspect policies, infrastructure developments, financial reforms, and social safety interventions with full Level 1–5 source attribution and verification dates.
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
                  <span>Export Selection (CSV)</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <AchievementFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
            totalResultsCount={achievements.length}
          />

          {/* Results Grid / List */}
          {achievements.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {achievements.map((item) => (
                <AchievementCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-gov-darkSurface border border-gov-border space-y-4 max-w-lg mx-auto">
              <div className="h-12 w-12 mx-auto rounded-full bg-amber-50 dark:bg-white/5 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Database className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gov-navy dark:text-white">
                  No records match your active filters
                </h3>
                <p className="text-xs text-gov-slate">
                  Try broadening your search query or resetting specific sector, state, or status criteria.
                </p>
              </div>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl text-xs font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementsCatalogue;
