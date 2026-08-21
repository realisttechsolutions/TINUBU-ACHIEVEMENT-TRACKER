import React from "react";
import { Search, X, LayoutGrid, List, SlidersHorizontal, RotateCcw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CANONICAL_PUBLIC_GROUPS, CANONICAL_SECTORS, DEMO_NIGERIA_STATES } from "@/adapters/canonicalData";

export interface FilterState {
  searchQuery: string;
  publicGroup: string;
  sectorId: string;
  status: string;
  verificationStatus?: string;
  state: string;
  year: string;
  sortBy: 'newest' | 'oldest' | 'title' | 'status';
}

interface AchievementFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const AchievementFilterBar: React.FC<AchievementFilterBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const hasActiveFilters =
    filters.searchQuery.trim() !== "" ||
    filters.publicGroup !== "all" ||
    filters.sectorId !== "all" ||
    filters.status !== "all" ||
    filters.state !== "all" ||
    filters.year !== "all";

  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 font-sans">
      {/* Primary Search & Quick Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Text Search */}
        <div className="sm:col-span-6 relative">
          <Search className="h-4 w-4 text-gov-navy dark:text-gov-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search policies, projects, MDAs, states, or outcomes..."
            className="w-full h-11 pl-10 pr-9 rounded-xl border border-gov-border bg-gov-canvas dark:bg-white/5 text-xs sm:text-sm text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none focus:ring-2 focus:ring-gov-navy dark:focus:ring-gov-gold"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gov-slate hover:text-gov-navy dark:hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 15 Canonical Sectors Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={filters.sectorId}
            onChange={(e) => onFilterChange({ sectorId: e.target.value })}
            aria-label="Filter by Sector"
            className="w-full h-11 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-navy cursor-pointer"
          >
            <option value="all">All 15 Canonical Sectors</option>
            {CANONICAL_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.publicLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            aria-label="Filter by Implementation Status"
            className="w-full h-11 px-3 rounded-xl border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs font-semibold text-gov-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-navy cursor-pointer"
          >
            <option value="all">All Implementation Statuses</option>
            <option value="operational">Operational</option>
            <option value="implementation_ongoing">Ongoing Execution</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
            <option value="enacted">Enacted into Law</option>
            <option value="funding_released">Funding Released</option>
            <option value="outcome_reported">Outcome Reported</option>
          </select>
        </div>
      </div>

      {/* Secondary Multi-Faceted Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gov-border/60 text-xs">
        {/* State Filter */}
        <div>
          <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">State / FCT</label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange({ state: e.target.value })}
            className="w-full h-9 px-2.5 rounded-lg border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs text-gov-navy dark:text-white cursor-pointer"
          >
            <option value="all">All 36 States + FCT</option>
            {DEMO_NIGERIA_STATES.map((st) => (
              <option key={st.slug} value={st.name}>
                {st.name} ({st.geopoliticalZone})
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">Mandate Year</label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="w-full h-9 px-2.5 rounded-lg border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs text-gov-navy dark:text-white cursor-pointer"
          >
            <option value="all">All Years (2023 - 2026)</option>
            <option value="2023">2023 (Inauguration & Reforms)</option>
            <option value="2024">2024 (Scale & Delivery)</option>
            <option value="2025">2025 (Operational Milestones)</option>
            <option value="2026">2026 (Consolidated Outcomes)</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-bold text-gov-slate uppercase mb-1">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full h-9 px-2.5 rounded-lg border border-gov-border bg-gov-canvas dark:bg-gov-darkSurface text-xs text-gov-navy dark:text-white cursor-pointer"
          >
            <option value="newest">Date: Newest First</option>
            <option value="oldest">Date: Oldest First</option>
            <option value="title">Title: A to Z</option>
            <option value="status">Status Priority</option>
          </select>
        </div>
      </div>

      {/* Footer Controls & Active Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gov-border/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-gov-navy dark:text-white tabular-nums">
            {totalResultsCount}
          </span>
          <span className="text-gov-slate">
            record{totalResultsCount === 1 ? "" : "s"} match your filters
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid View"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-gov-navy text-gov-gold shadow-sm"
                : "bg-gov-canvas dark:bg-white/10 text-gov-slate hover:text-gov-navy"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List View"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-gov-navy text-gov-gold shadow-sm"
                : "bg-gov-canvas dark:bg-white/10 text-gov-slate hover:text-gov-navy"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementFilterBar;
