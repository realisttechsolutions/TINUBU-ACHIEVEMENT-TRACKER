import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Building2, Calendar, FileCheck } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import DataClassificationBadge from "../common/DataClassificationBadge";
import SourceBadge from "../common/SourceBadge";
import { AchievementRecord } from "@/types/achievement";

interface AchievementCardProps {
  item: AchievementRecord;
  viewMode?: "grid" | "list";
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  item,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl p-5 shadow-xs hover:shadow-md hover:border-gov-gold/50 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group">
        <div className="space-y-2 flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} size="sm" />
            <DataClassificationBadge classification={item.classification} size="sm" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded">
              {item.sector}
            </span>
          </div>

          <h3 className="text-lg font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-gov-slate line-clamp-2 leading-relaxed">
            {item.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gov-slate pt-1">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-gov-navy shrink-0" />
              <span>{item.leadMinistryOrAgency}</span>
            </span>
            {item.geopoliticalZone && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gov-navy shrink-0" />
                <span>{item.geopoliticalZone}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-gov-navy shrink-0" />
              <span>Verified: {item.verificationDate}</span>
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-start md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gov-border/60">
          <div className="p-2.5 rounded-lg bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/40 text-xs font-semibold text-gov-navy dark:text-white max-w-xs">
            <span className="text-gov-emerald font-bold">Result: </span>
            {item.impactOutcome}
          </div>

          <Link
            to={`/achievements/${item.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-navy hover:text-gov-emerald transition-colors pt-1"
          >
            <span>View Full Record</span>
            <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gov-darkSurface border border-gov-border rounded-xl shadow-xs hover:shadow-md hover:border-gov-gold/50 transition-all duration-200 p-5 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gov-border/60 pb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={item.status} size="sm" />
            <DataClassificationBadge classification={item.classification} size="sm" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gov-gold bg-gov-navy px-2 py-0.5 rounded">
            {item.sector}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold font-display text-gov-navy dark:text-white group-hover:text-gov-emerald transition-colors leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Factual Summary */}
        <p className="text-xs text-gov-slate leading-relaxed line-clamp-3">
          {item.summary}
        </p>

        {/* Key Impact Outcome Callout */}
        <div className="p-3 rounded-lg bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/40 text-xs text-gov-navy dark:text-white font-medium">
          <span className="font-bold text-gov-emerald">Result: </span>
          {item.impactOutcome}
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="pt-3 border-t border-gov-border/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-gov-slate">
          <span className="inline-flex items-center gap-1 truncate max-w-[60%]">
            <Building2 className="h-3.5 w-3.5 text-gov-navy shrink-0" />
            <span className="truncate">{item.leadMinistryOrAgency}</span>
          </span>
          <SourceBadge
            sourceName={item.sources[0]?.name || "Official Gazette"}
            level={item.sources[0]?.level || 1}
          />
        </div>

        <Link
          to={`/achievements/${item.slug}`}
          className="inline-flex items-center justify-between w-full pt-1 text-xs font-bold text-gov-navy hover:text-gov-emerald transition-colors"
        >
          <span>View Full Achievement Record</span>
          <ArrowRight className="h-3.5 w-3.5 text-gov-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AchievementCard;
