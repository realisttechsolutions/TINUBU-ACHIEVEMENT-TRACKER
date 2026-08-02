import React from "react";
import { Compass, List } from "lucide-react";

interface MapViewToggleProps {
  viewMode: "map" | "table";
  onViewChange: (mode: "map" | "table") => void;
}

export const MapViewToggle: React.FC<MapViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-gov-canvas dark:bg-gov-navy p-1 rounded-lg border border-gov-border shrink-0">
      <button
        onClick={() => onViewChange("map")}
        className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
          viewMode === "map" ? "bg-white dark:bg-gov-darkSurface text-gov-navy dark:text-white shadow-xs" : "text-gov-slate"
        }`}
      >
        <Compass className="h-3.5 w-3.5" />
        Vector Map
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors ${
          viewMode === "table" ? "bg-white dark:bg-gov-darkSurface text-gov-navy dark:text-white shadow-xs" : "text-gov-slate"
        }`}
      >
        <List className="h-3.5 w-3.5" />
        Accessible Table List
      </button>
    </div>
  );
};

export default MapViewToggle;
