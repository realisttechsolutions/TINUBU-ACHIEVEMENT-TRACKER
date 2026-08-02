import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StateImpactSummary } from "@/types/geography.types";

interface StateOverviewProps {
  summary: StateImpactSummary;
}

export const StateOverview: React.FC<StateOverviewProps> = ({ summary }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gov-border dark:bg-gov-navy/30">
        <CardContent className="p-5 space-y-2">
          <span className="text-xs font-bold text-gov-slate uppercase tracking-wider">
            State-Specific Projects
          </span>
          <p className="text-3xl font-extrabold text-gov-emerald">
            {summary.stateSpecificRecordsCount}
          </p>
          <p className="text-xs text-gov-slate">
            Targeted infrastructure & state-level interventions
          </p>
        </CardContent>
      </Card>

      <Card className="border-gov-border dark:bg-gov-navy/30">
        <CardContent className="p-5 space-y-2">
          <span className="text-xs font-bold text-gov-slate uppercase tracking-wider">
            Multi-State & Coastal Corridors
          </span>
          <p className="text-3xl font-extrabold text-gov-gold">
            {summary.multiStateRecordsCount}
          </p>
          <p className="text-xs text-gov-slate">
            Highways, hydro dams, and regional trade networks
          </p>
        </CardContent>
      </Card>

      <Card className="border-gov-border dark:bg-gov-navy/30">
        <CardContent className="p-5 space-y-2">
          <span className="text-xs font-bold text-gov-slate uppercase tracking-wider">
            National Schemes Active
          </span>
          <p className="text-3xl font-extrabold text-gov-navy dark:text-white">
            {summary.nationalRecordsCount}
          </p>
          <p className="text-xs text-gov-slate">
            NELFUND student loans, CCT & healthcare funds
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default StateOverview;
