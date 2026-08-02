import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronRight, FileText, Layers, Award, MapPin, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { navigationItems, NavigationItemConfig } from "@/navigation/navigation.config";
import { getPublicSectors } from "@/services/sectorService";
import { achievementsData } from "@/data/achievements/achievements.data";
import { getAllStates } from "@/services/geographyService";
import { getAllTimelineEvents } from "@/services/timelineService";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when opened & handle shortcut / ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const publicSectors = getPublicSectors();
  const allStates = getAllStates();
  const allTimelineEvents = getAllTimelineEvents();
  const lowerQuery = query.trim().toLowerCase();

  const matchingNavItems = lowerQuery
    ? navigationItems.filter(
        (item) =>
          item.label.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.keywords.some((k) => k.toLowerCase().includes(lowerQuery))
      )
    : navigationItems;

  const matchingSectors = lowerQuery
    ? publicSectors.filter(
        (sector) =>
          sector.title.toLowerCase().includes(lowerQuery) ||
          sector.summary.toLowerCase().includes(lowerQuery) ||
          sector.indicators.some((ind) => ind.name.toLowerCase().includes(lowerQuery))
      )
    : [];

  const matchingStates = lowerQuery
    ? allStates.filter(
        (st) =>
          st.name.toLowerCase().includes(lowerQuery) ||
          st.capital.toLowerCase().includes(lowerQuery) ||
          st.zone.toLowerCase().includes(lowerQuery)
      )
    : [];

  const matchingTimelineEvents = lowerQuery
    ? allTimelineEvents.filter(
        (tle) =>
          tle.title.toLowerCase().includes(lowerQuery) ||
          tle.summary.toLowerCase().includes(lowerQuery) ||
          tle.leadAgency.toLowerCase().includes(lowerQuery) ||
          tle.category.toLowerCase().includes(lowerQuery)
      )
    : [];

  const matchingAchievements = lowerQuery
    ? achievementsData.filter(
        (ach) =>
          ach.title.toLowerCase().includes(lowerQuery) ||
          ach.summary.toLowerCase().includes(lowerQuery) ||
          ach.leadMinistryOrAgency.toLowerCase().includes(lowerQuery)
      )
    : [];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      {/* Backdrop trigger */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gov-border flex items-center gap-3 bg-gov-canvas dark:bg-gov-navy/30">
          <Search className="h-5 w-5 text-gov-navy shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies, sector metrics, reports, and methodology..."
            className="w-full bg-transparent text-sm md:text-base text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-gov-slate hover:text-gov-navy"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-semibold bg-white dark:bg-gov-navy px-2 py-0.5 rounded border border-gov-border text-gov-slate">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Sector Results */}
          {matchingSectors.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-3 block mb-1">
                Sectors ({matchingSectors.length})
              </span>
              {matchingSectors.map((sector) => (
                <button
                  key={sector.slug}
                  type="button"
                  onClick={() => handleSelect(`/sectors/${sector.slug}`)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gov-canvas dark:hover:bg-gov-navy/30 group"
                >
                  <div className="p-2 rounded bg-gov-emerald text-white shrink-0 mt-0.5">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald">
                        {sector.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Sector
                      </span>
                    </div>
                    <p className="text-xs text-gov-slate line-clamp-1 mt-0.5">
                      {sector.summary}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gov-slate group-hover:text-gov-navy shrink-0 self-center" />
                </button>
              ))}
            </div>
          )}

          {/* State Results */}
          {matchingStates.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-3 block mb-1">
                States & Locations ({matchingStates.length})
              </span>
              {matchingStates.map((st) => (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => handleSelect(`/states/${st.slug}`)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gov-canvas dark:hover:bg-gov-navy/30 group"
                >
                  <div className="p-2 rounded bg-gov-gold text-gov-navy shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald">
                        {st.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gov-navy bg-gov-canvas px-2 py-0.5 rounded">
                        {st.zone} Zone
                      </span>
                    </div>
                    <p className="text-xs text-gov-slate line-clamp-1 mt-0.5">
                      Capital: {st.capital} • {st.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gov-slate group-hover:text-gov-navy shrink-0 self-center" />
                </button>
              ))}
            </div>
          )}

          {/* Timeline Policy Event Results */}
          {matchingTimelineEvents.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-3 block mb-1">
                Policy & Timeline Events ({matchingTimelineEvents.length})
              </span>
              {matchingTimelineEvents.map((tle) => (
                <button
                  key={tle.id}
                  type="button"
                  onClick={() => handleSelect("/timeline")}
                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gov-canvas dark:hover:bg-gov-navy/30 group"
                >
                  <div className="p-2 rounded bg-blue-600 text-white shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gov-navy dark:text-white group-hover:text-gov-emerald">
                        {tle.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gov-navy bg-gov-canvas px-2 py-0.5 rounded">
                        {tle.date}
                      </span>
                    </div>
                    <p className="text-xs text-gov-slate line-clamp-1 mt-0.5">
                      {tle.category} • {tle.summary}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gov-slate group-hover:text-gov-navy shrink-0 self-center" />
                </button>
              ))}
            </div>
          )}

          {/* Achievement Results */}
          {matchingAchievements.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-3 block mb-1">
                Achievements ({matchingAchievements.length})
              </span>
              {matchingAchievements.map((ach) => (
                <button
                  key={ach.id}
                  type="button"
                  onClick={() => handleSelect(`/achievements/${ach.slug}`)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gov-canvas dark:hover:bg-gov-navy/30 group"
                >
                  <div className="p-2 rounded bg-gov-gold text-gov-navy shrink-0 mt-0.5">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gov-navy dark:text-white group-hover:text-gov-emerald line-clamp-1">
                        {ach.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gov-slate bg-gov-canvas px-2 py-0.5 rounded shrink-0">
                        {ach.sector}
                      </span>
                    </div>
                    <p className="text-xs text-gov-slate line-clamp-1 mt-0.5">
                      {ach.summary}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gov-slate group-hover:text-gov-navy shrink-0 self-center" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Items */}
          {matchingNavItems.length > 0 && (
            <div>
              {lowerQuery && (
                <span className="text-[11px] font-bold text-gov-slate uppercase tracking-wider px-3 block mb-1">
                  Pages & Navigation ({matchingNavItems.length})
                </span>
              )}
              {matchingNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-gov-canvas dark:hover:bg-gov-navy/30 group"
                  >
                    <div className="p-2 rounded bg-gov-navy text-gov-gold shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gov-navy dark:text-white group-hover:text-gov-emerald">
                          {item.label}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gov-slate bg-gov-canvas px-2 py-0.5 rounded">
                          {item.group}
                        </span>
                      </div>
                      <p className="text-xs text-gov-slate line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gov-slate group-hover:text-gov-navy shrink-0 self-center" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {matchingSectors.length === 0 && matchingAchievements.length === 0 && matchingNavItems.length === 0 && (
            <div className="py-12 text-center text-gov-slate space-y-2">
              <FileText className="h-8 w-8 mx-auto opacity-40" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs">Try searching for keywords like "GDP", "Subsidy", "Infrastructure", or "Security".</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-gov-border bg-gov-canvas dark:bg-gov-navy/20 flex justify-between items-center text-xs text-gov-slate">
          <span>Search scope: Public platform pages & sector indicators</span>
          <span className="hidden sm:inline">Use ↑ ↓ to navigate</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
