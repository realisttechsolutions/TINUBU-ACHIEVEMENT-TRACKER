'use client';

import React, { useState } from "react";
import { Link } from "@/lib/navigation";
import { 
  Calendar, 
  Building2, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  FileText,
  MapPin,
  ChevronDown,
  ChevronUp,
  Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineEventRecord } from "@/types/timeline.types";
import InterventionStageBadge from "./InterventionStageBadge";

interface PolicyTimelineViewerProps {
  events: TimelineEventRecord[];
}

export const PolicyTimelineViewer: React.FC<PolicyTimelineViewerProps> = ({ events }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (events.length === 0) {
    return (
      <Card className="border-gov-border dark:bg-gov-navy/30 p-12 text-center text-gov-slate">
        <FileText className="h-12 w-12 mx-auto text-gov-gold opacity-50 mb-3" />
        <h3 className="text-base font-bold text-gov-navy dark:text-white mb-1">
          No Timeline Events Match Selected Filters
        </h3>
        <p className="text-xs max-w-md mx-auto">
          Try adjusting your stage, sector, or year selection to view administration policy events.
        </p>
      </Card>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto space-y-6">
      {/* Central Connector Line for Desktop */}
      <div className="hidden md:block absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-gov-navy via-gov-emerald to-gov-gold/40 z-0"></div>

      {events.map((event, index) => {
        const isExpanded = expandedIds.includes(event.id);
        const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <div key={event.id} className="relative z-10 md:pl-16">
            {/* Timeline Marker Dot */}
            <div className="hidden md:flex absolute left-6 top-6 -translate-x-1/2 h-5 w-5 rounded-full bg-white dark:bg-gov-navy border-4 border-gov-emerald shadow-md items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gov-emerald"></span>
            </div>

            <Card className="border-gov-border dark:bg-gov-navy/40 hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-5 md:p-6 space-y-4">
                {/* Header Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-gov-border/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-gov-slate font-bold">
                      <Calendar className="h-3.5 w-3.5 text-gov-gold" />
                      {formattedDate} ({event.quarter} {event.year})
                    </span>
                    <InterventionStageBadge stage={event.stage} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold border-gov-border">
                      {event.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200">
                      {event.verificationStatus}
                    </Badge>
                  </div>
                </div>

                {/* Event Title */}
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-bold text-gov-navy dark:text-white leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gov-slate leading-relaxed">
                    {event.summary}
                  </p>
                </div>

                {/* Expected or Measured Impact Callout */}
                {event.expectedOrMeasuredImpact && (
                  <div className="bg-gov-canvas dark:bg-gov-navy/60 p-3 rounded-lg border-l-4 border-gov-emerald text-xs space-y-1">
                    <span className="font-bold text-gov-navy dark:text-white block uppercase text-[10px] tracking-wider">
                      Targeted / Verified Impact:
                    </span>
                    <p className="text-gov-navy dark:text-slate-200 font-medium">
                      {event.expectedOrMeasuredImpact}
                    </p>
                  </div>
                )}

                {/* Expandable Details Section */}
                {isExpanded && (
                  <div className="pt-3 border-t border-gov-border/60 space-y-3 text-xs animate-accordion-down">
                    <p className="text-gov-slate leading-relaxed">
                      {event.details}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-gov-navy/80 p-3 rounded-lg border border-gov-border/60">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gov-slate block">Lead Implementing Agency</span>
                        <span className="font-semibold text-gov-navy dark:text-white flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-gov-emerald" />
                          {event.leadAgency}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gov-slate block">Geographic Scope</span>
                        <span className="font-semibold text-gov-navy dark:text-white flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-gov-gold" />
                          {event.statesCovered?.join(", ") || event.geopoliticalZone}
                        </span>
                      </div>
                    </div>

                    {/* Sources List */}
                    {event.primarySources.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-gov-slate block">
                          Primary Source Documentation:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {event.primarySources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-gov-canvas dark:bg-gov-navy border border-gov-border rounded text-[11px] font-semibold text-gov-navy dark:text-white hover:text-gov-emerald transition-colors"
                            >
                              <FileText className="h-3 w-3 text-gov-gold" />
                              {source.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gov-border/40 text-xs">
                  <button
                    onClick={() => toggleExpand(event.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gov-navy dark:text-white hover:text-gov-emerald transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Collapse Details <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        Expand Full Event Details & Sources <ChevronDown className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  {event.relatedAchievementSlug && (
                    <Link
                      to={`/achievements/${event.relatedAchievementSlug}`}
                      className="inline-flex items-center gap-1 font-bold text-gov-emerald hover:underline text-xs"
                    >
                      <Award className="h-3.5 w-3.5" />
                      View Related Achievement Record
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default PolicyTimelineViewer;
