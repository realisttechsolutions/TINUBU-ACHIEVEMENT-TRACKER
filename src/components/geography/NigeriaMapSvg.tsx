import React from "react";
import { nigeriaStatePaths, NIGERIA_MAP_VIEWBOX } from "@/data/geography/nigeria-states.geojson";
import { getStateByCode } from "@/services/geographyService";
import { GeopoliticalZone } from "@/types/geography.types";

interface NigeriaMapSvgProps {
  selectedStateCode?: string | null;
  hoveredStateCode?: string | null;
  activeState?: string | null;
  activeZone?: string;
  onStateHover?: (code: string | null) => void;
  onStateSelect?: (code: string) => void;
  getZoneColor?: (zone: GeopoliticalZone) => string;
}

export const NigeriaMapSvg: React.FC<NigeriaMapSvgProps> = ({
  selectedStateCode = null,
  hoveredStateCode = null,
  activeState = null,
  activeZone = "all",
  onStateHover = () => {},
  onStateSelect = () => {},
  getZoneColor = () => "#006B3F",
}) => {
  const currentSelected = selectedStateCode || activeState || null;

  return (
    <svg
      viewBox={NIGERIA_MAP_VIEWBOX}
      className="w-full h-full max-w-full drop-shadow-md select-none"
      aria-label="Interactive Map of Nigeria 36 States and Federal Capital Territory"
      role="region"
    >
      {nigeriaStatePaths.map((statePath) => {
        const stateObj = getStateByCode(statePath.code);
        const isSelected = currentSelected === statePath.code;
        const isHovered = hoveredStateCode === statePath.code;
        const isZoneFiltered =
          activeZone !== "all" && stateObj && stateObj.zone.toLowerCase() !== activeZone.toLowerCase();

        const baseZoneColor = stateObj ? getZoneColor(stateObj.zone) : "#475569";

        // Fill color hierarchy:
        // - Zone filtered out: Muted Slate / low opacity
        // - Selected: Nigeria Emerald / High Intensity
        // - Hovered: Refined Gold or highlighted zone color
        // - Normal: Base Geopolitical Zone color
        let fillColor = baseZoneColor;
        let fillOpacity = 0.75;
        let strokeColor = "#FFFFFF";
        let strokeWidth = "1.2";

        if (isZoneFiltered) {
          fillColor = "#64748B";
          fillOpacity = 0.2;
          strokeColor = "#94A3B8";
          strokeWidth = "0.8";
        } else if (isSelected) {
          fillColor = "#006B3F";
          fillOpacity = 0.98;
          strokeColor = "#C5A059";
          strokeWidth = "3.5";
        } else if (isHovered) {
          fillColor = baseZoneColor;
          fillOpacity = 0.95;
          strokeColor = "#C5A059";
          strokeWidth = "2.5";
        }

        return (
          <g key={statePath.code} className="transition-all duration-150">
            {/* Real SVG State Polygon Path */}
            <path
              d={statePath.d}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="cursor-pointer transition-colors duration-150 focus:outline-none"
              onMouseEnter={() => onStateHover(statePath.code)}
              onMouseLeave={() => onStateHover(null)}
              onClick={() => onStateSelect(statePath.code)}
              tabIndex={0}
              role="button"
              aria-label={`${statePath.name} State, ${stateObj?.zone || "Nigeria"}${isSelected ? " (Selected)" : ""}`}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStateSelect(statePath.code);
                }
              }}
            />

            {/* State Label Text at Visual Centroid */}
            <text
              x={statePath.center[0]}
              y={statePath.center[1]}
              textAnchor="middle"
              dominantBaseline="central"
              className={`pointer-events-none text-[10px] sm:text-[11px] font-extrabold transition-opacity fill-white ${
                isZoneFiltered ? "opacity-25" : isSelected ? "opacity-100 font-black" : "opacity-90"
              }`}
              style={{
                textShadow: isSelected
                  ? "0px 1px 3px rgba(0,0,0,0.9), 0px 0px 4px #C5A059"
                  : "0px 1px 2px rgba(0,0,0,0.85)",
              }}
            >
              {statePath.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default NigeriaMapSvg;
