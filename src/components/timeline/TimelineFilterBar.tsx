import React from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { InterventionStage, TimelineCategory, TimelineFilterOptions } from "@/types/timeline.types";

interface TimelineFilterBarProps {
  filters: TimelineFilterOptions;
  onFilterChange: (newFilters: TimelineFilterOptions) => void;
  onReset: () => void;
  totalResultsCount: number;
}

export const TimelineFilterBar: React.FC<TimelineFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResultsCount,
}) => {
  const stages: { value: InterventionStage | "all"; label: string }[] = [
    { value: "all", label: "All Implementation Stages" },
    { value: "announcement", label: "Stage 1: Announcement" },
    { value: "approval", label: "Stage 2: FEC / Assent" },
    { value: "appropriation", label: "Stage 3: Funding Allocated" },
    { value: "implementation", label: "Stage 4: Work Ongoing" },
    { value: "operational", label: "Stage 5: Operational / Live" },
    { value: "impact", label: "Stage 6: Impact Milestone" },
  ];

  const categories: { value: TimelineCategory | "all"; label: string }[] = [
    { value: "all", label: "All Sectors & Categories" },
    { value: "Economic Reform", label: "Economic Reform" },
    { value: "Fiscal & Monetary", label: "Fiscal & Monetary" },
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Energy & Power", label: "Energy & Power" },
    { value: "Education", label: "Education" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Security", label: "Security" },
    { value: "Governance", label: "Governance" },
  ];

  return (
    <div className="bg-white dark:bg-gov-navy/40 p-4 md:p-6 rounded-2xl border border-gov-border space-y-4 shadow-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
          <input
            type="text"
            placeholder="Search policy events, agencies, laws..."
            value={filters.searchQuery || ""}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white"
          />
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          <span className="text-gov-slate font-medium">
            Showing <strong className="text-gov-navy dark:text-white">{totalResultsCount}</strong> Events
          </span>

          {(filters.stage !== "all" || filters.category !== "all" || (filters.year && filters.year !== "all") || filters.searchQuery) && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-gov-navy dark:text-white hover:text-gov-emerald font-semibold transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gov-border/60">
        {/* Stage Filter */}
        <select
          value={filters.stage || "all"}
          onChange={(e) => onFilterChange({ ...filters, stage: e.target.value as any })}
          className="w-full py-2 px-3 text-xs bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white font-medium"
        >
          {stages.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={filters.category || "all"}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value as any })}
          className="w-full py-2 px-3 text-xs bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white font-medium"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={filters.year || "all"}
          onChange={(e) => onFilterChange({ ...filters, year: e.target.value === "all" ? "all" : Number(e.target.value) })}
          className="w-full py-2 px-3 text-xs bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white font-medium"
        >
          <option value="all">All Delivery Years</option>
          <option value={2023}>2023 Administration Milestones</option>
          <option value={2024}>2024 Administration Milestones</option>
          <option value={2025}>2025 Administration Milestones</option>
        </select>
      </div>
    </div>
  );
};

export default TimelineFilterBar;
