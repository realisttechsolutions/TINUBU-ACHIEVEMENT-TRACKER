import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { StateRecord, StateImpactSummary } from "@/types/geography.types";

interface StateHeroProps {
  state: StateRecord;
  summary: StateImpactSummary;
}

export const StateHero: React.FC<StateHeroProps> = ({ state, summary }) => {
  return (
    <section className="bg-gov-navy text-white py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-gov-gold text-gov-navy font-extrabold uppercase text-xs">
              {state.zone} Zone
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white text-xs">
              ISO: {state.code}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            {state.name}
          </h1>

          <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed">
            {state.description}
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div>
              Capital City: <strong className="text-white">{state.capital}</strong>
            </div>
            <div>
              Documented Records: <strong className="text-gov-gold">{summary.totalPublishedRecords} Interventions</strong>
            </div>
            {state.officialPortal && (
              <a
                href={state.officialPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gov-gold font-semibold hover:underline"
              >
                Official State Portal
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateHero;
