import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  ChevronRight, 
  Building2, 
  Award, 
  ExternalLink, 
  List, 
  Compass, 
  Info,
  CheckCircle2,
  Layers,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  getAllStates, 
  getGeopoliticalZones, 
  getStateByCode, 
  getStateImpactSummary 
} from "@/services/geographyService";
import { nigeriaStatePaths, NIGERIA_MAP_VIEWBOX } from "@/data/geography/nigeria-states.geojson";
import { StateRecord, GeopoliticalZone } from "@/types/geography.types";

interface NigeriaImpactMapProps {
  onSelectState?: (state: StateRecord) => void;
  selectedZoneFilter?: string;
}

export const NigeriaImpactMap: React.FC<NigeriaImpactMapProps> = ({
  onSelectState,
  selectedZoneFilter,
}) => {
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>("NG-LA");
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [activeZone, setActiveZone] = useState<string>(selectedZoneFilter || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allStates = getAllStates();
  const zones = getGeopoliticalZones();

  const selectedState = selectedStateCode ? getStateByCode(selectedStateCode) : undefined;
  const selectedStateSummary = selectedStateCode ? getStateImpactSummary(selectedState?.slug || "") : undefined;

  const filteredStates = allStates.filter((st) => {
    const matchesZone = activeZone === "all" || st.zone.toLowerCase() === activeZone.toLowerCase();
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const getZoneColor = (zoneName: GeopoliticalZone) => {
    switch (zoneName) {
      case "North-Central": return "#2563EB"; // Blue
      case "North-East": return "#7C3AED"; // Purple
      case "North-West": return "#059669"; // Emerald
      case "South-East": return "#D97706"; // Amber
      case "South-South": return "#DC2626"; // Red
      case "South-West": return "#0284C7"; // Sky
      default: return "#475569";
    }
  };

  const handleStateClick = (stateCode: string) => {
    setSelectedStateCode(stateCode);
    const state = getStateByCode(stateCode);
    if (state && onSelectState) {
      onSelectState(state);
    }
  };

  return (
    <div className="space-y-6">
      {/* View & Zone Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-gov-navy/30 p-4 rounded-xl border border-gov-border">
        {/* Zone Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveZone("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeZone === "all"
                ? "bg-gov-navy text-white"
                : "bg-gov-canvas dark:bg-gov-navy text-gov-slate hover:text-gov-navy"
            }`}
          >
            All Zones (36 + FCT)
          </button>
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeZone === zone.id
                  ? "bg-gov-navy text-white"
                  : "bg-gov-canvas dark:bg-gov-navy text-gov-slate hover:text-gov-navy"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full inline-block"
                style={{ backgroundColor: zone.color }}
              />
              {zone.name}
            </button>
          ))}
        </div>

        {/* View Mode Switch (Map vs Accessible Table) */}
        <div className="flex items-center gap-1 bg-gov-canvas dark:bg-gov-navy p-1 rounded-lg border border-gov-border shrink-0">
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
              viewMode === "map" ? "bg-white dark:bg-gov-darkSurface text-gov-navy dark:text-white shadow-xs" : "text-gov-slate"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Vector Map
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
              viewMode === "table" ? "bg-white dark:bg-gov-darkSurface text-gov-navy dark:text-white shadow-xs" : "text-gov-slate"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Accessible Table List
          </button>
        </div>
      </div>

      {/* Main Content Area: Map View vs Table View */}
      {viewMode === "map" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Vector Display Column */}
          <div className="lg:col-span-8 bg-white dark:bg-gov-navy/30 p-6 rounded-2xl border border-gov-border relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gov-slate flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-gov-gold" />
                Interactive Geopolitical Map of Nigeria
              </span>
              <span className="text-[11px] text-gov-slate">Click state polygon to inspect interventions</span>
            </div>

            {/* SVG Map Container */}
            <div className="relative w-full aspect-[5/4] max-h-[550px] flex items-center justify-center">
              <svg
                viewBox={NIGERIA_MAP_VIEWBOX}
                className="w-full h-full drop-shadow-md select-none"
                aria-label="Interactive Map of Nigeria States"
              >
                {nigeriaStatePaths.map((statePath) => {
                  const stateObj = getStateByCode(statePath.code);
                  const isSelected = selectedStateCode === statePath.code;
                  const isHovered = hoveredStateCode === statePath.code;
                  const isZoneFiltered =
                    activeZone !== "all" && stateObj && stateObj.zone.toLowerCase() !== activeZone.toLowerCase();

                  const zoneColor = stateObj ? getZoneColor(stateObj.zone) : "#475569";

                  return (
                    <g key={statePath.code}>
                      <path
                        d={statePath.d}
                        fill={isZoneFiltered ? "#E2E8F0" : isSelected ? "#047857" : isHovered ? zoneColor : zoneColor}
                        fillOpacity={isZoneFiltered ? 0.3 : isSelected ? 0.95 : isHovered ? 0.85 : 0.6}
                        stroke={isSelected ? "#10B981" : "#FFFFFF"}
                        strokeWidth={isSelected ? "3" : "1.5"}
                        className="cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onMouseEnter={() => setHoveredStateCode(statePath.code)}
                        onMouseLeave={() => setHoveredStateCode(null)}
                        onClick={() => handleStateClick(statePath.code)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${statePath.name} State`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleStateClick(statePath.code);
                          }
                        }}
                      />
                      {/* State Label Text */}
                      <text
                        x={statePath.center[0]}
                        y={statePath.center[1]}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`pointer-events-none text-[11px] font-extrabold transition-opacity fill-white dark:fill-slate-100 ${
                          isZoneFiltered ? "opacity-30" : "opacity-90"
                        }`}
                        style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}
                      >
                        {statePath.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Zone Legend */}
            <div className="mt-6 pt-4 border-t border-gov-border flex flex-wrap items-center justify-between gap-3 text-xs text-gov-slate">
              <span className="font-bold uppercase text-[10px] tracking-wider text-gov-navy dark:text-white">Geopolitical Zone Key:</span>
              <div className="flex flex-wrap items-center gap-3">
                {zones.map((z) => (
                  <div key={z.id} className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: z.color }} />
                    <span className="text-[11px]">{z.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected State Inspector Panel Column */}
          <div className="lg:col-span-4 space-y-6">
            {selectedState && selectedStateSummary ? (
              <Card className="border-gov-border dark:bg-gov-navy/40 shadow-lg overflow-hidden">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: getZoneColor(selectedState.zone) }}
                />

                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gov-gold">
                        {selectedState.zone} Zone
                      </span>
                      <h3 className="text-2xl font-black text-gov-navy dark:text-white">
                        {selectedState.name}
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold border-gov-border">
                      {selectedState.code}
                    </Badge>
                  </div>

                  <p className="text-xs text-gov-slate mb-6">
                    {selectedState.description}
                  </p>

                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-xl border border-gov-border/60">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-gov-slate">Capital</span>
                      <p className="text-sm font-bold text-gov-navy dark:text-white">{selectedState.capital}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-gov-slate">Published Records</span>
                      <p className="text-sm font-extrabold text-gov-emerald">{selectedStateSummary.totalPublishedRecords}</p>
                    </div>
                  </div>

                  {/* Breakdown of Record Scopes */}
                  <div className="space-y-2 mb-6 text-xs">
                    <span className="font-bold text-gov-slate uppercase text-[10px] tracking-wider block">
                      Geographic Scope Breakdown
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center bg-white dark:bg-gov-navy/40 p-2 rounded border border-gov-border/50">
                        <span className="text-gov-navy dark:text-slate-200">State-Specific Interventions</span>
                        <span className="font-bold text-gov-emerald">{selectedStateSummary.stateSpecificRecordsCount}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white dark:bg-gov-navy/40 p-2 rounded border border-gov-border/50">
                        <span className="text-gov-navy dark:text-slate-200">Multi-State / Coastal Corridors</span>
                        <span className="font-bold text-gov-gold">{selectedStateSummary.multiStateRecordsCount}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white dark:bg-gov-navy/40 p-2 rounded border border-gov-border/50">
                        <span className="text-gov-navy dark:text-slate-200">National Programs (NELFUND / CCT)</span>
                        <span className="font-bold text-gov-navy dark:text-white">{selectedStateSummary.nationalRecordsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer Notice */}
                  <div className="mb-6 p-2.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 border border-blue-200/60 text-[11px] flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Published record count reflects evidence currently indexed in the platform, not total state governance performance.</span>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/states/${selectedState.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gov-navy hover:bg-gov-emerald text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    View Complete {selectedState.shortName} State Dashboard
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gov-border dark:bg-gov-navy/30 p-8 text-center text-gov-slate">
                <Compass className="h-10 w-10 mx-auto text-gov-slate opacity-40 mb-3" />
                <p className="text-sm font-semibold">Select any state on the map to inspect documented achievements.</p>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Accessible Tabular Alternative View */
        <div className="bg-white dark:bg-gov-navy/30 p-6 rounded-2xl border border-gov-border shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-gov-navy dark:text-white flex items-center gap-2">
              <List className="h-5 w-5 text-gov-emerald" />
              State-by-State Impact Directory ({filteredStates.length} Units)
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
              <input
                type="text"
                placeholder="Filter states by name, capital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gov-canvas dark:bg-gov-navy border-b border-gov-border text-gov-slate uppercase font-bold tracking-wider">
                  <th className="p-3">State</th>
                  <th className="p-3">Capital</th>
                  <th className="p-3">Geopolitical Zone</th>
                  <th className="p-3">Documented Interventions</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {filteredStates.map((st) => {
                  const summary = getStateImpactSummary(st.slug);
                  return (
                    <tr key={st.code} className="hover:bg-gov-canvas/60 dark:hover:bg-gov-navy/50 transition-colors">
                      <td className="p-3 font-bold text-gov-navy dark:text-white">
                        <Link to={`/states/${st.slug}`} className="hover:text-gov-emerald">
                          {st.name}
                        </Link>
                      </td>
                      <td className="p-3 text-gov-slate">{st.capital}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getZoneColor(st.zone) }} />
                          {st.zone}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gov-emerald">
                        {summary?.totalPublishedRecords || 0} Records
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/states/${st.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gov-navy dark:text-white hover:text-gov-emerald"
                        >
                          Dashboard <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NigeriaImpactMap;
