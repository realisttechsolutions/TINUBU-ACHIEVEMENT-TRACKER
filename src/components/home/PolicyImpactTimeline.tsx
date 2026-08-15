import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, ShieldCheck, ChevronRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { dataAdapter } from "@/adapters/dataAdapter";

export const PolicyImpactTimeline: React.FC = () => {
  const events = dataAdapter.getTimelineEvents().slice(0, 4);

  return (
    <section className="py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-gold uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-gov-emerald" />
              <span>Chronological Milestones (May 2023 — August 2026)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gov-navy dark:text-white">
              From Policy Enactment to Verified Delivery
            </h2>
            <p className="text-sm text-gov-slate leading-relaxed">
              Track how major presidential directives and National Assembly acts transition through statutory Gazettes, cash release warrants, procurement, and physical commissioning.
            </p>
          </div>

          <Link
            to="/timeline"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gov-emerald hover:text-emerald-700 transition-colors shrink-0"
          >
            <span>Explore Full National Timeline</span>
            <ArrowRight className="h-4 w-4 text-gov-gold" />
          </Link>
        </div>

        {/* Timeline Events Flow */}
        <div className="relative border-l-2 border-gov-gold/40 ml-4 sm:ml-8 space-y-6 pl-6 sm:pl-8 py-2">
          {events.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline Indicator Pin */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-2 h-4 w-4 rounded-full bg-gov-navy border-2 border-gov-gold group-hover:bg-gov-emerald transition-colors" />

              <div className="p-5 rounded-2xl bg-gov-canvas dark:bg-white/5 border border-gov-border hover:border-gov-gold/40 hover:shadow-md transition-all space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono text-gov-navy dark:text-gov-gold tabular-nums">
                      {event.eventDate}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gov-slate bg-white dark:bg-gov-navy px-2 py-0.5 rounded border border-gov-border">
                      {event.sectorName.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gov-emerald uppercase tracking-wider">
                    {event.eventTypeLabel}
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-gov-navy dark:text-white leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-gov-slate leading-relaxed">
                  {event.summary}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-gov-slate">
                  <span>Lead Actor: <strong className="text-gov-navy dark:text-white">{event.leadActor}</strong></span>
                  <Link
                    to="/timeline"
                    className="inline-flex items-center gap-1 font-bold text-gov-navy dark:text-gov-gold hover:text-gov-emerald transition-colors"
                  >
                    <span>View Timeline Stream</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicyImpactTimeline;
