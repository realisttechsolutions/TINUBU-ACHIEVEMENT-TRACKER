import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  X, 
  ArrowRight, 
  Award, 
  Building2, 
  FileText, 
  Layers, 
  MapPin, 
  Clock, 
  CornerDownLeft,
  Sparkles,
  History
} from "lucide-react";
import { dataAdapter } from "@/adapters/dataAdapter";
import { GlobalSearchResultItem } from "@/adapters/types";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "NELFUND Student Loans",
    "Lagos-Calabar Coastal Highway",
    "Electricity Act 2023",
    "FX Market Unification",
    "CREDICORP"
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Execute query via dataAdapter
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchResults = dataAdapter.searchGlobal(query);
    if (selectedCategory === "All") {
      setResults(searchResults);
    } else {
      setResults(searchResults.filter(r => r.category === selectedCategory));
    }
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex]);
    }
  };

  const handleSelectResult = (item: GlobalSearchResultItem) => {
    // Add to recents
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    onClose();
    navigate(item.url);
  };

  if (!isOpen) return null;

  const categories = ["All", "Achievements", "Projects", "Policies", "Sectors", "States"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Achievements": return <Award className="h-4 w-4 text-gov-gold" />;
      case "Projects": return <Building2 className="h-4 w-4 text-blue-600" />;
      case "Policies": return <FileText className="h-4 w-4 text-indigo-600" />;
      case "Sectors": return <Layers className="h-4 w-4 text-emerald-600" />;
      case "States": return <MapPin className="h-4 w-4 text-rose-600" />;
      default: return <Search className="h-4 w-4 text-gov-slate" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gov-navy/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-gov-darkSurface rounded-2xl shadow-2xl border border-gov-border overflow-hidden z-10 animate-scale-in"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gov-border flex items-center gap-3 bg-gov-canvas dark:bg-white/5">
          <Search className="h-5 w-5 text-gov-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified achievements, projects, policies, sectors, states..."
            className="w-full bg-transparent text-sm sm:text-base text-gov-navy dark:text-white placeholder:text-gov-slate focus:outline-none"
            aria-label="Global search query"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-gov-slate hover:text-gov-navy rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-white dark:bg-gov-navy border text-gov-slate">
              ESC
            </kbd>
          )}
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-gov-border/60 flex items-center gap-1.5 overflow-x-auto text-xs bg-white dark:bg-gov-darkSurface">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-gov-navy text-gov-gold font-bold shadow-sm"
                  : "bg-gov-canvas text-gov-slate hover:text-gov-navy hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Stream / Default Suggestions */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {query.trim().length >= 2 ? (
            results.length > 0 ? (
              <div className="space-y-1">
                {results.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-gov-canvas dark:bg-white/10 border border-gov-gold/40"
                          : "hover:bg-gov-canvas/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-white dark:bg-gov-navy border shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-gov-navy dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-gov-slate truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {item.badgeText && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-gov-emerald/10 text-gov-emerald border border-gov-emerald/20">
                            {item.badgeText}
                          </span>
                        )}
                        <ArrowRight className={`h-4 w-4 text-gov-gold transition-transform ${isSelected ? "translate-x-1" : "opacity-40"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Search className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-gov-navy dark:text-white">
                  No verified records found for "{query}"
                </p>
                <p className="text-xs text-gov-slate max-w-sm mx-auto">
                  Try searching for sectors like "Power", "Education", "Highways", or initiatives like "NELFUND" and "Student Loans".
                </p>
              </div>
            )
          ) : (
            /* Default Suggested Queries */
            <div className="p-3 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gov-slate uppercase tracking-wider mb-2">
                  <History className="h-3.5 w-3.5" />
                  <span>Popular National Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 rounded-lg bg-gov-canvas dark:bg-white/5 hover:bg-gov-emerald/10 hover:text-gov-emerald text-xs font-medium text-gov-navy dark:text-gray-200 border border-gov-border transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3 text-gov-gold" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gov-border/60">
                <div className="text-[11px] text-gov-slate">
                  <span className="font-bold text-gov-navy dark:text-white">Tip:</span> Use arrow keys <kbd className="px-1 border rounded text-[10px]">↑</kbd> <kbd className="px-1 border rounded text-[10px]">↓</kbd> to navigate and <kbd className="px-1 border rounded text-[10px]">ENTER</kbd> to open.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gov-canvas dark:bg-gov-darkSurface border-t border-gov-border flex items-center justify-between text-[11px] text-gov-slate">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gov-emerald" />
            <span>Official 2023 — 2026 Public Intelligence Index</span>
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" /> Select
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
