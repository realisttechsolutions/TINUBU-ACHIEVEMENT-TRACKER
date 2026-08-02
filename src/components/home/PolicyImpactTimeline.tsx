import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "../common/StatusBadge";
import { timelineEventsData } from "@/data/home/homepage.config";

export const PolicyImpactTimeline: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gov-darkSurface border-b border-gov-border font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gov-border/60 pb-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-emerald uppercase tracking-wider">
              <Clock className="h-4 w-4 text-gov-gold" />
              <span>Implementation Roadmap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gov-navy dark:text-white tracking-tight">
              From Policy to Impact
            </h2>
            <p className="text-sm text-gov-slate">
              Track how major decisions move from announcement and approval through implementation, delivery and measurable outcome.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-gov-border text-gov-navy hover:bg-gov-canvas gap-2 shrink-0 self-start md:self-auto"
            asChild
          >
            <Link to="/economic-reforms">
              <span>View Full Economic Timeline</span>
              <ArrowRight className="h-4 w-4 text-gov-emerald" />
            </Link>
          </Button>
        </div>

        {/* Timeline Events Stack */}
        <div className="relative border-l-2 border-gov-gold/40 ml-3 sm:ml-6 space-y-6 pl-6 sm:pl-8 py-2">
          {timelineEventsData.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-gov-navy border-2 border-gov-gold group-hover:bg-gov-emerald transition-colors" />

              <div className="bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/60 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border/40 pb-2">
                  <span className="text-xs font-extrabold text-gov-navy dark:text-white font-display">
                    {event.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-gov-slate bg-white px-2 py-0.5 rounded border border-gov-border">
                      {event.sector}
                    </span>
                    <StatusBadge status={event.status} size="sm" />
                  </div>
                </div>

                <h4 className="text-base font-bold font-display text-gov-navy dark:text-white">
                  {event.title}
                </h4>

                <p className="text-xs text-gov-slate leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 text-[11px] text-gov-slate font-medium">
                  Source: <span className="text-gov-navy dark:text-gray-300">{event.sourceName}</span>
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
