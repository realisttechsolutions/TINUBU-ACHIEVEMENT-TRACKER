import React from "react";
import { Search, X, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const AchievementFilterBar: React.FC<AchievementFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedSector !== "all" ||
    selectedStatus !== "all" ||
    selectedType !== "all";

  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 font-sans">
      {/* Top Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="h-4 w-4 text-gov-navy absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search policies, projects, agencies, or locations..."
            className="w-full h-10 pl-9 pr-8 rounded-lg border border-gov-border bg-gov-canvas dark:bg-gov-navy/20 text-xs sm:text-sm text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none focus:ring-2 focus:ring-gov-navy"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gov-slate hover:text-gov-navy"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sector Select */}
        <div className="sm:col-span-3">
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            aria-label="Filter by Sector"
            className="w-full h-10 px-3 rounded-lg border border-gov-border bg-gov-canvas text-xs font-semibold text-gov-navy focus:outline-none focus:ring-2 focus:ring-gov-navy cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="economy">Economy & Fiscal</option>
            <option value="security">Security & Defense</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="social-services">Social Services</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by Status"
            className="w-full h-10 px-3 rounded-lg border border-gov-border bg-gov-canvas text-xs font-semibold text-gov-navy focus:outline-none focus:ring-2 focus:ring-gov-navy cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Implementation Ongoing">Implementation Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Outcome Recorded">Outcome Recorded</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Secondary Bar: Type Select, View Mode Toggle, and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gov-border/60">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Type Select */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="Filter by Type"
            className="h-8 px-2.5 rounded border border-gov-border bg-gov-canvas text-xs font-semibold text-gov-navy focus:outline-none cursor-pointer"
          >
            <option value="all">All Achievement Types</option>
            <option value="physical-project">Physical Projects</option>
            <option value="policy-reform">Policy Reforms</option>
            <option value="programme-intervention">Interventions</option>
            <option value="reported-outcome">Reported Outcomes</option>
          </select>

          <span className="text-xs text-gov-slate font-medium">
            Showing <strong className="text-gov-navy dark:text-white font-bold">{totalResultsCount}</strong> records
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-gov-slate hover:text-gov-emerald font-bold underline mr-2"
            >
              Reset Filters
            </button>
          )}

          <div className="inline-flex rounded-md border border-gov-border p-0.5 bg-gov-canvas">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-gov-navy text-gov-gold shadow-xs"
                  : "text-gov-slate hover:text-gov-navy"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === "list"
                  ? "bg-gov-navy text-gov-gold shadow-xs"
                  : "text-gov-slate hover:text-gov-navy"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementFilterBar;
