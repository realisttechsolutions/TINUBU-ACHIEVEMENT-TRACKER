import React, { useState } from "react";
import { Link, useNavigate } from "@/lib/navigation";
import { Compass, MapPin, ArrowRight, Layers, Building2, ExternalLink } from "lucide-react";
import NigeriaMapSvg from "@/components/geography/NigeriaMapSvg";
import { DEMO_NIGERIA_STATES } from "@/adapters/canonicalData";
import { getStateByCode } from "@/services/geographyService";
import { getStateSlug } from "@/lib/geography/nigeria-state-mapping";

export const NationalImpactPreview: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);
  const spotlightStates = DEMO_NIGERIA_STATES.slice(0, 6);

  const activeHoveredState = hoveredStateCode ? getStateByCode(hoveredStateCode) : undefined;
  const activeSelectedState = selectedStateCode ? getStateByCode(selectedStateCode) : undefined;
  const displayState = activeHoveredState || activeSelectedState;

  const handleStateSelect = (stateCode: string) => {
    setSelectedStateCode(stateCode);
    const slug = getStateSlug(stateCode);
    if (slug) {
      navigate(`/impact-map?state=${slug}`);
    }
  };

  return (
    <section className="py-16 bg-gov-navy text-white border-b border-gov-gold/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gov-emerald/20 via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-gov-gold/40 text-gov-gold text-xs font-bold uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5 text-gov-emerald" />
              <span>36 States & Federal Capital Territory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight text-white">
              National Impact & Geographic Footprint
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Every region benefits from coordinated federal investments. Explore documented infrastructure corridors, social interventions, and institutional reforms state-by-state.
            </p>
          </div>

          <Link
            to="/impact-map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gov-emerald hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-lg"
          >
            <span>Open Full Interactive Map</span>
            <ArrowRight className="h-4 w-4 text-gov-gold" />
          </Link>
        </div>

        {/* 2-Column Grid: Map Visual Gateway + State Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Map Gateway */}
          <div className="lg:col-span-7 bg-gov-darkSurface/90 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gov-emerald animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-gov-gold">
                  Interactive Geographic Gateway
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                Click any state to explore verified interventions
              </span>
            </div>

            {/* Dynamic State Hover Indicator Bar */}
            <div className="min-h-[32px] mb-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              {displayState ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gov-emerald" />
                    {displayState.name} ({displayState.zone} Zone)
                  </span>
                  <span className="text-[11px] text-gov-gold font-semibold flex items-center gap-1">
                    Explore on Map <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 text-[11px]">
                  Hover or select any state polygon to inspect regional scope
                </span>
              )}
            </div>

            {/* Interactive Vector SVG Map Container */}
            <div className="h-[320px] sm:h-[400px] flex items-center justify-center">
              <NigeriaMapSvg
                hoveredStateCode={hoveredStateCode}
                selectedStateCode={selectedStateCode}
                onStateHover={setHoveredStateCode}
                onStateSelect={handleStateSelect}
              />
            </div>

            {/* Zone Matrix Badges */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap gap-2">
                {['North-Central', 'North-East', 'North-West', 'South-East', 'South-South', 'South-West'].map((zone) => (
                  <span key={zone} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 text-[10px] font-medium">
                    {zone}
                  </span>
                ))}
              </div>
              <Link
                to="/impact-map"
                className="text-[11px] font-bold text-gov-gold hover:underline inline-flex items-center gap-1"
              >
                Launch National Impact Map <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Right Column: State Impact Spotlight Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-gov-gold uppercase tracking-wider px-1">
              Sub-National Highlights
            </div>

            <div className="space-y-2.5">
              {spotlightStates.map((state) => (
                <Link
                  key={state.slug}
                  to={`/states/${state.slug}`}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-gov-gold/40 hover:bg-white/10 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-gov-navy border border-white/10 text-gov-gold shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white group-hover:text-gov-emerald transition-colors truncate">
                        {state.name} State
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {state.highlightProject}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <div className="text-xs font-extrabold text-gov-gold tabular-nums">
                      {state.projectCount} Projects
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {state.geopoliticalZone}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/states"
              className="block text-center w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors border border-white/10"
            >
              View Directory of All 36 States & FCT →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NationalImpactPreview;
