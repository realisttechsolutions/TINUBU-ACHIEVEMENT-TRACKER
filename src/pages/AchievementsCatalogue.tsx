import React, { useState, useMemo } from "react";
import PageHead from "@/components/SEO/PageHead";
import AchievementFilterBar from "@/components/achievements/AchievementFilterBar";
import AchievementCard from "@/components/achievements/AchievementCard";
import { achievementsData } from "@/data/achievements/achievements.data";
import { Award, ShieldCheck, Database } from "lucide-react";

export const AchievementsCatalogue: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAchievements = useMemo(() => {
    return achievementsData.filter((item) => {
      // 1. Text Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesMinistry = item.leadMinistryOrAgency.toLowerCase().includes(query);
        const matchesZone = item.geopoliticalZone?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesMinistry && !matchesZone) {
          return false;
        }
      }

      // 2. Sector Filter
      if (selectedSector !== "all" && item.sector !== selectedSector) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      // 4. Achievement Type Filter
      if (selectedType !== "all" && item.achievementType !== selectedType) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSector, selectedStatus, selectedType]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSector("all");
    setSelectedStatus("all");
    setSelectedType("all");
  };

  return (
    <>
      <PageHead
        title="Achievement Catalogue | Tinubu Achievement Tracker"
        description="Searchable, evidence-backed repository of policies, infrastructure projects, reforms, and measurable national outcomes under President Bola Ahmed Tinubu's administration."
        keywords="Nigeria achievement catalogue, Tinubu progress database, coastal highway, NELFUND loans, economic reforms Nigeria"
      />

      <div className="bg-gov-canvas dark:bg-gov-navy/10 min-h-screen py-8 sm:py-12 font-sans space-y-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gov-navy text-white rounded-2xl p-6 sm:p-10 border border-gov-gold/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="h-64 w-64 text-gov-gold" />
            </div>

            <div className="relative z-10 space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified National Progress Record</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Achievement Catalogue
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                Search and explore policies, infrastructure developments, financial reforms, and social safety interventions with full Level 1–5 source attribution and verification dates.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <AchievementFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSector={selectedSector}
            onSectorChange={setSelectedSector}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
            totalResultsCount={filteredAchievements.length}
          />

          {/* Results Grid / List */}
          {filteredAchievements.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAchievements.map((item) => (
                <AchievementCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-8 space-y-4">
              <Database className="h-12 w-12 text-gov-slate mx-auto opacity-40" />
              <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white">
                No matching achievement records found
              </h3>
              <p className="text-xs text-gov-slate max-w-md mx-auto">
                We couldn't find any achievements matching your active search query or filter criteria. Try broadening your keywords or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-gov-navy text-gov-gold font-bold text-xs hover:bg-gov-emerald hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AchievementsCatalogue;
