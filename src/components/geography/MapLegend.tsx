import React from "react";
import { ZoneRecord } from "@/types/geography.types";

interface MapLegendProps {
  zones: ZoneRecord[];
}

export const MapLegend: React.FC<MapLegendProps> = ({ zones }) => {
  return (
    <div className="mt-6 pt-4 border-t border-gov-border flex flex-wrap items-center justify-between gap-3 text-xs text-gov-slate">
      <span className="font-bold uppercase text-[10px] tracking-wider text-gov-navy dark:text-white">
        Geopolitical Zone Key:
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: z.color }} />
            <span className="text-[11px] font-medium text-gov-navy dark:text-slate-200">{z.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
