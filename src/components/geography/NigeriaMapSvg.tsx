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
  const activeCode = selectedStateCode || activeState || null;
  return (
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
              onMouseEnter={() => onStateHover(statePath.code)}
              onMouseLeave={() => onStateHover(null)}
              onClick={() => onStateSelect(statePath.code)}
              tabIndex={0}
              role="button"
              aria-label={`${statePath.name} State`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onStateSelect(statePath.code);
                }
              }}
            />
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
  );
};

export default NigeriaMapSvg;
