import React from "react";
import { Info, FileCheck } from "lucide-react";

export const GeographicEvidenceSummary: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gov-navy/30 p-6 md:p-8 rounded-2xl border border-gov-border space-y-4 text-xs md:text-sm text-gov-slate">
      <div className="flex items-center gap-2 text-base font-bold text-gov-navy dark:text-white">
        <FileCheck className="h-5 w-5 text-gov-emerald" />
        <h3>Geographic Attribution & Evidence Calibration</h3>
      </div>
      <p>
        Every geographic marker, state connection, and coastal corridor in this tracker is tied directly to verified public gazettes, Federal Ministry of Works EIA documentation, CBN statistical reports, or NELFUND institutional disbursement portals.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-lg border border-gov-border/60">
          <strong className="text-gov-navy dark:text-white block mb-1">State-Specific</strong>
          Explicitly verified within one state boundary (e.g. 700MW Zungeru Dam in Niger State).
        </div>
        <div className="bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-lg border border-gov-border/60">
          <strong className="text-gov-navy dark:text-white block mb-1">Multi-State Corridors</strong>
          Cross-boundary linear infrastructure (e.g. 700km Coastal Highway across 9 maritime states).
        </div>
        <div className="bg-gov-canvas dark:bg-gov-navy/50 p-3 rounded-lg border border-gov-border/60">
          <strong className="text-gov-navy dark:text-white block mb-1">National Schemes</strong>
          Federal policy frameworks covering eligible tertiary students & vulnerable households in all 36 States + FCT.
        </div>
      </div>
    </div>
  );
};

export default GeographicEvidenceSummary;
