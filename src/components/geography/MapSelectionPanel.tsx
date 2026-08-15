import React from "react";
import { Link } from "@/lib/navigation";
import { ChevronRight, Info, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StateRecord, StateImpactSummary, GeopoliticalZone } from "@/types/geography.types";

interface MapSelectionPanelProps {
  selectedState?: StateRecord;
  selectedStateSummary?: StateImpactSummary;
  getZoneColor: (zone: GeopoliticalZone) => string;
}

export const MapSelectionPanel: React.FC<MapSelectionPanelProps> = ({
  selectedState,
  selectedStateSummary,
  getZoneColor,
}) => {
  if (!selectedState || !selectedStateSummary) {
    return (
      <Card className="border-gov-border dark:bg-gov-navy/30 p-8 text-center text-gov-slate">
        <Compass className="h-10 w-10 mx-auto text-gov-slate opacity-40 mb-3" />
        <p className="text-sm font-semibold">Select any state on the map to inspect documented achievements.</p>
      </Card>
    );
  }

  return (
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
  );
};

export default MapSelectionPanel;
